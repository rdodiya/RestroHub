package com.restroly.qrmenu.order.service;

import com.restroly.qrmenu.common.enums.OrderPaymentStatus;
import com.restroly.qrmenu.common.enums.OrderSource;
import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.dto.CreateOrderRequest;
import com.restroly.qrmenu.order.dto.OrderResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {

  /** Creates an order; source is derived from the table (table 0 = counter QR, else table QR). */
  OrderResponse createOrder(CreateOrderRequest request);

  /** Creates an order with an explicit source (e.g. STAFF for the secure endpoint). */
  OrderResponse createOrder(CreateOrderRequest request, OrderSource source);

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
      OrderPaymentStatus paymentStatus,
      Integer tableNumber,
      OrderSource orderSource,
      Pageable pageable);
}
