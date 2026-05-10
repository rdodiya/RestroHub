//com/Restroly/qrmenu/order/mapper/OrderMapper.java
package com.restroly.qrmenu.order.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.restroly.qrmenu.order.dto.OrderItemResponse;
import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.order.entity.OrderItem;

@Component
public class OrderMapper {

	 public OrderResponse toResponse(Order order) {
	     if (order == null) return null;
//	return null;
	     return OrderResponse.builder()
	             .orderId(order.getOrderId())
	             .branchId(order.getBranch().getBranchId())
	             .branchName(order.getBranch().getName())
	             .tableId(order.getTable().getTableId())
	             .tableNumber(order.getTable().getTableNumber())
	             .customerName(order.getCustomerName())
	             .customerPhone(order.getCustomerPhone())
	             .specialInstructions(order.getSpecialInstructions())
	             .totalAmount(order.getTotalAmount())
	             .status(order.getStatus())
	             .createdAt(order.getCreatedAt())
	             .items(toItemResponseList(order.getOrderItems()))
	             .build();
	 }

	public List<OrderItemResponse> toItemResponseList(List<OrderItem> items) {
		if (items == null)
			return List.of();

		return items.stream().map(this::toItemResponse).collect(Collectors.toList());
	}

	 public OrderItemResponse toItemResponse(OrderItem item) {
	     if (item == null) return null;
//	return null;
	     return OrderItemResponse.builder()
	             .id(item.getOrderItemid())
	             .foodId(item.getFood().getFoodId())
	             .foodName(item.getFood().getName())
	             .foodImageUrl(item.getFood().getImageUrl())
	             .isVeg(item.getFood().getIsVeg())
	             .quantity(item.getQuantity())
	             .unitPrice(item.getUnitPrice())
	             .subtotal(item.getSubtotal())
	             .specialRequest(item.getSpecialRequest())
	             .build();
	 }
}