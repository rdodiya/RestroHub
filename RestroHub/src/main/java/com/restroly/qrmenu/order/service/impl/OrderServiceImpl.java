// com/restroly/qrmenu/order/service/impl/OrderServiceImpl.java
package com.restroly.qrmenu.order.service.impl;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
import com.restroly.qrmenu.common.enums.OrderPaymentStatus;
import com.restroly.qrmenu.common.enums.OrderSource;
import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.exception.ResourceNotFoundException;
import com.restroly.qrmenu.food.entity.Food;
import com.restroly.qrmenu.food.repository.FoodRepository;
import com.restroly.qrmenu.order.builder.OrderDirector;
import com.restroly.qrmenu.order.dto.CreateOrderRequest;
import com.restroly.qrmenu.order.dto.OrderItemRequest;
import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.order.mapper.OrderMapper;
import com.restroly.qrmenu.order.repository.OrderRepository;
import com.restroly.qrmenu.order.service.OrderEventPublisher;
import com.restroly.qrmenu.order.service.OrderNotificationService;
import com.restroly.qrmenu.order.service.OrderService;
import com.restroly.qrmenu.table.entity.Tables;
import com.restroly.qrmenu.table.repository.TablesRepository;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional
public class OrderServiceImpl implements OrderService {

  @Autowired private OrderRepository orderRepository;
  @Autowired private BranchRepository branchRepository;
  @Autowired private TablesRepository tableRepository;
  @Autowired private FoodRepository foodRepository;
  @Autowired private OrderNotificationService notificationService;
  @Autowired private OrderEventPublisher eventPublisher;

  @Autowired private OrderDirector orderDirector;
  @Autowired private OrderMapper orderMapper;

  @Override
  public OrderResponse createOrder(CreateOrderRequest request) {
    return createOrder(request, null);
  }

  @Override
  public OrderResponse createOrder(CreateOrderRequest request, OrderSource source) {
    log.debug(
        "Creating order for branch: {}, table: {}", request.getBranchId(), request.getTableId());

    // Fetch branch
    Branch branch =
        branchRepository
            .findByBranchIdAndIsDeleteFalse(request.getBranchId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Branch not found with id: " + request.getBranchId()));

    // Fetch table
    Tables table =
        tableRepository
            .findByTableIdAndIsActiveTrue(request.getTableId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Table not found with id: " + request.getTableId()));

    // Fetch all food items
    List<Long> foodIds =
        request.getItems().stream().map(OrderItemRequest::getFoodId).collect(Collectors.toList());

    List<Food> foods = foodRepository.findByFoodIdInAndIsDeleteFalse(foodIds);

    if (foods.size() != foodIds.size()) {
      throw new ResourceNotFoundException("One or more food items not found");
    }

    // Build order using Builder Pattern
    Order order = orderDirector.buildOrderFromRequest(request, branch, table, foods);

    order.setOrderSource(
        source != null
            ? source
            : Integer.valueOf(0).equals(table.getTableNumber())
                ? OrderSource.COUNTER_QR
                : OrderSource.TABLE_QR);

    // Save order
    Order savedOrder = orderRepository.save(order);
    log.info("Order created successfully with id: {}", savedOrder.getOrderId());

    // Send notification to admin
    notificationService.notifyNewOrder(savedOrder);
    eventPublisher.orderCreated(savedOrder);

    // Storing paymentId in order for better utility
    savedOrder.setPaymentId(branch.getBranchUpiId());
    return orderMapper.toResponse(savedOrder);
  }

  @Override
  @Transactional(readOnly = true)
  public OrderResponse getOrderById(Long orderId) {
    log.debug("Fetching order by id: {}", orderId);
    Order order = findOrderById(orderId);
    return orderMapper.toResponse(order);
  }

  @Override
  @Transactional(readOnly = true)
  public List<OrderResponse> getOrdersByBranch(Long branchId) {
    log.debug("Fetching all orders for branchId: {}", branchId);
    List<Order> orders = orderRepository.findByBranchBranchIdOrderByCreatedAtDesc(branchId);
    return orders.stream().map(orderMapper::toResponse).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<OrderResponse> getActiveOrdersByBranch(Long branchId) {
    log.debug("Fetching active orders for branchId: {}", branchId);
    List<OrderStatus> activeStatuses =
        Arrays.asList(
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.READY,
            OrderStatus.SERVED,
            OrderStatus.BILLED);

    List<Order> orders = orderRepository.findActiveOrdersByBranch(branchId, activeStatuses);
    return orders.stream().map(orderMapper::toResponse).collect(Collectors.toList());
  }

  @Override
  public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
    log.debug("Updating order status - orderId: {}, newStatus: {}", orderId, status);
    Order order = findOrderById(orderId);
    order.setStatus(status);
    Order updatedOrder = orderRepository.save(order);

    eventPublisher.orderStatusChanged(updatedOrder);
    // Notify about status change
    notificationService.notifyOrderStatusChange(updatedOrder);
    log.info("Order {} status updated to {}", orderId, status);
    return orderMapper.toResponse(updatedOrder);
  }

  @Override
  public OrderResponse cancelOrder(Long orderId) {
    log.debug("Cancelling order with id: {}", orderId);
    Order order = findOrderById(orderId);
    order.setStatus(OrderStatus.CANCELLED);
    Order canceledOrder = orderRepository.save(order);
    eventPublisher.orderStatusChanged(canceledOrder);
    log.info("Order {} cancelled", orderId);
    return orderMapper.toResponse(canceledOrder);
  }

  @Override
  public Page<OrderResponse> getOrderHistory(
      Long branchId,
      String startDate,
      String endDate,
      OrderStatus status,
      String phone,
      OrderPaymentStatus paymentStatus,
      Integer tableNumber,
      OrderSource orderSource,
      Pageable pageable) {
    log.debug("Fetching order history for branchId: {}", branchId);

    Specification<Order> spec =
        (root, query, criteriaBuilder) -> {
          List<Predicate> predicates = new ArrayList<>();
          predicates.add(criteriaBuilder.equal(root.get("branch").get("branchId"), branchId));

          if (status != null) {
            predicates.add(criteriaBuilder.equal(root.get("status"), status));
          }

          if (phone != null && !phone.isBlank()) {
            predicates.add(criteriaBuilder.like(root.get("customerPhone"), "%" + phone + "%"));
          }

          if (paymentStatus != null) {
            predicates.add(criteriaBuilder.equal(root.get("paymentStatus"), paymentStatus));
          }

          if (tableNumber != null) {
            predicates.add(
                criteriaBuilder.equal(root.get("table").get("tableNumber"), tableNumber));
          }

          if (orderSource != null) {
            predicates.add(criteriaBuilder.equal(root.get("orderSource"), orderSource));
          }

          if (startDate != null && !startDate.isBlank() && endDate != null && !endDate.isBlank()) {
            try {
              DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
              LocalDateTime start = LocalDate.parse(startDate, formatter).atStartOfDay();
              LocalDateTime end = LocalDate.parse(endDate, formatter).atTime(23, 59, 59);
              predicates.add(criteriaBuilder.between(root.get("createdAt"), start, end));
            } catch (Exception e) {
              log.warn("Invalid date format for order history filter: {} - {}", startDate, endDate);
            }
          }

          return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

    Page<Order> ordersPage = orderRepository.findAll(spec, pageable);
    return ordersPage.map(orderMapper::toResponse);
  }

  @Override
  public int markAllActiveOrdersReady(Long branchId) {
    log.debug("Marking all active orders as READY for branchId: {}", branchId);
    // Active kitchen statuses that need preparation
    List<OrderStatus> targetStatuses =
        Arrays.asList(OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING);
    List<Order> orders = orderRepository.findActiveOrdersByBranch(branchId, targetStatuses);

    int updatedCount = 0;
    for (Order order : orders) {
      order.setStatus(OrderStatus.READY);
    }

    List<Order> updatedOrders = orderRepository.saveAll(orders);

    for (Order updatedOrder : updatedOrders) {
      try {
        notificationService.notifyOrderStatusChange(updatedOrder);
        eventPublisher.orderStatusChanged(updatedOrder);
      } catch (Exception ex) {
        log.warn(
            "Could not send status notification for order {}: {}",
            updatedOrder.getOrderId(),
            ex.getMessage());
      }
      updatedCount++;
    }
    log.info("Successfully marked {} orders as READY for branch {}", updatedCount, branchId);
    return updatedCount;
  }

  private Order findOrderById(Long orderId) {
    log.debug("Finding order by ID: {}", orderId);
    return orderRepository
        .findById(orderId)
        .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
  }
}
