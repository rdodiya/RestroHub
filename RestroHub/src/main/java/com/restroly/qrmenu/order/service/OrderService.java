package com.restroly.qrmenu.order.service;

import java.util.List;

import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.dto.CreateOrderRequest;
import com.restroly.qrmenu.order.dto.OrderResponse;

public interface OrderService {

	OrderResponse createOrder(CreateOrderRequest request);

	OrderResponse getOrderById(Long orderId);

	List<OrderResponse> getOrdersByBranch(Long branchId);

	List<OrderResponse> getActiveOrdersByBranch(Long branchId);

	OrderResponse updateOrderStatus(Long orderId, OrderStatus status);

	void cancelOrder(Long orderId);
}