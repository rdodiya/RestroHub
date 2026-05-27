//com/restroly/qrmenu/order/service/impl/OrderServiceImpl.java
package com.restroly.qrmenu.order.service.impl;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.branch.repository.BranchRepository;
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
import com.restroly.qrmenu.order.service.OrderService;
import com.restroly.qrmenu.order.service.OrderNotificationService;
import com.restroly.qrmenu.table.entity.Tables;
import com.restroly.qrmenu.table.repository.TablesRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class OrderServiceImpl implements OrderService {

	@Autowired
	private OrderRepository orderRepository;
	@Autowired
	private BranchRepository branchRepository;
	@Autowired
	private TablesRepository tableRepository;
	@Autowired
	private FoodRepository foodRepository;
	@Autowired
	private OrderNotificationService notificationService;
	
	private final OrderDirector orderDirector = new OrderDirector();
	private final OrderMapper orderMapper = new OrderMapper();

	@Override
	public OrderResponse createOrder(CreateOrderRequest request) {
		log.debug("Creating order for branch: {}, table: {}", request.getBranchId(), request.getTableId());

		// Fetch branch
		Branch branch = branchRepository.findByBranchIdAndIsDeleteFalse(request.getBranchId())
				.orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + request.getBranchId()));

		// Fetch table
		Tables table = tableRepository.findByTableIdAndIsActiveTrue(request.getTableId())
				.orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + request.getTableId()));

		// Fetch all food items
		List<Long> foodIds = request.getItems().stream().map(OrderItemRequest::getFoodId).collect(Collectors.toList());

		List<Food> foods = foodRepository.findByFoodIdInAndIsDeleteFalse(foodIds);

		if (foods.size() != foodIds.size()) {
			throw new ResourceNotFoundException("One or more food items not found");
		}

		// Build order using Builder Pattern
		Order order = orderDirector.buildOrderFromRequest(request, branch, table, foods);

		// Save order
		Order savedOrder = orderRepository.save(order);
    	log.info("Order created successfully with id: {}", savedOrder.getOrderId());

		// Send notification to admin
		notificationService.notifyNewOrder(savedOrder);

		//Storing paymentId in order for better utility
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
		List<OrderStatus> activeStatuses = Arrays.asList(OrderStatus.PENDING, OrderStatus.CONFIRMED,
				OrderStatus.PREPARING, OrderStatus.READY);

		List<Order> orders = orderRepository.findActiveOrdersByBranch(branchId, activeStatuses);
		return orders.stream().map(orderMapper::toResponse).collect(Collectors.toList());
	}

	@Override
	public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
		log.debug("Updating order status - orderId: {}, newStatus: {}", orderId, status);
		Order order = findOrderById(orderId);
		order.setStatus(status);
		Order updatedOrder = orderRepository.save(order);

		// Notify about status change
		notificationService.notifyOrderStatusChange(updatedOrder);
		log.info("Order {} status updated to {}", orderId, status);
		return orderMapper.toResponse(updatedOrder);
	}

	@Override
	public void cancelOrder(Long orderId) {
		log.debug("Cancelling order with id: {}", orderId);
		Order order = findOrderById(orderId);
		order.setStatus(OrderStatus.CANCELLED);
		orderRepository.save(order);
    	log.info("Order {} cancelled", orderId);
	}

	private Order findOrderById(Long orderId) {
		log.debug("Finding order by ID: {}", orderId);
		return orderRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
	}
}