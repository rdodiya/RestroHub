// com/Restroly/qrmenu/order/mapper/OrderMapper.java
package com.restroly.qrmenu.order.mapper;

import com.restroly.qrmenu.order.dto.OrderItemResponse;
import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.order.entity.OrderItem;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

  public OrderResponse toResponse(Order order) {
    if (order == null) return null;
    //	return null;
    return OrderResponse.builder()
        .orderId(order.getOrderId())
        // 2026-11-07 - NPE when branch or table is null - Add safe null checks
        .branchId(order.getBranch() != null ? order.getBranch().getBranchId() : null)
        .branchName(order.getBranch() != null ? order.getBranch().getName() : null)
        .tableId(order.getTable() != null ? order.getTable().getTableId() : null)
        .tableNumber(order.getTable() != null ? order.getTable().getTableNumber() : null)
        .customerName(order.getCustomerName())
        .customerPhone(order.getCustomerPhone())
        .specialInstructions(order.getSpecialInstructions())
        .totalAmount(order.getTotalAmount())
        .status(order.getStatus())
        .paymentStatus(order.getPaymentStatus())
        .orderSource(order.getOrderSource())
        .createdAt(order.getCreatedAt())
        .items(toItemResponseList(order.getOrderItems()))
        .paymentLink(order.getPaymentId())
        .build();
  }

  public List<OrderItemResponse> toItemResponseList(List<OrderItem> items) {
    if (items == null) return List.of();

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
