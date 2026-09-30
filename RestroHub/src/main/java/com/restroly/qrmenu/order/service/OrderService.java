package com.restroly.qrmenu.order.service;

import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.dto.CreateOrderRequest;
import com.restroly.qrmenu.order.dto.OrderResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {

  OrderResponse createOrder(CreateOrderRequest request);

  OrderResponse getOrderById(Long orderId);

  List<OrderResponse> getOrdersByBranch(Long branchId);

  List<OrderResponse> getActiveOrdersByBranch(Long branchId);

  OrderResponse updateOrderStatus(Long orderId, OrderStatus status);

  OrderResponse cancelOrder(Long orderId);

  int markAllActiveOrdersReady(Long branchId);

  Page<OrderResponse> getOrderHistory(
      Long branchId,
      String startDate,
      String endDate,
      OrderStatus status,
      String phone,
      Pageable pageable);
}
