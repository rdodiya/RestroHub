package com.restroly.qrmenu.order.mapper;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.entity.Order;
import org.junit.jupiter.api.Test;

class OrderMapperTest {

  private final OrderMapper mapper = new OrderMapper();

  @Test
  void toResponseHandlesNullTableAndBranchWithoutNpe() {
    // 2026-11-07 - Test null safety on order without table/branch
    Order order = new Order();
    order.setOrderId(1L);
    order.setCustomerName("Walk-in Customer");

    OrderResponse response = assertDoesNotThrow(() -> mapper.toResponse(order));
    assertNull(response.getTableId());
    assertNull(response.getTableNumber());
    assertNull(response.getBranchId());
    assertNull(response.getBranchName());
  }
}
