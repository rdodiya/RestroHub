package com.restroly.qrmenu.order.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.notification.service.LiveNotificationService;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.table.entity.Tables;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

class OrderEventPublisherTest {

  private final LiveNotificationService live = mock(LiveNotificationService.class);
  private final OrderEventPublisher publisher = new OrderEventPublisher(live);

  private Order order() {
    Restaurant restaurant = new Restaurant();
    restaurant.setRestId(7L);
    Branch branch = new Branch();
    branch.setBranchId(3L);
    branch.setRestaurant(restaurant);
    Tables table = new Tables();
    table.setTableNumber(12);
    Order order = new Order();
    order.setOrderId(99L);
    order.setBranch(branch);
    order.setTable(table);
    order.setStatus(OrderStatus.READY);
    order.setTotalAmount(new BigDecimal("450.00"));
    return order;
  }

  @Test
  void broadcastsSmallEventWithoutFinancialsToBranchTopic() {
    publisher.orderStatusChanged(order());

    ArgumentCaptor<Object> payload = ArgumentCaptor.forClass(Object.class);
    verify(live).broadcast(eq("/topic/restaurant/7/branch/3/orders"), payload.capture());
    assertThat(payload.getValue())
        .isEqualTo(
            new OrderEventPublisher.OrderEvent(
                "ORDER_STATUS_CHANGED", 99L, "ORD-99", OrderStatus.READY, 12, 3L));
    assertThat(payload.getValue().toString()).doesNotContain("450");
  }

  @Test
  void broadcastFailureNeverPropagates() {
    doThrow(new IllegalStateException("broker down")).when(live).broadcast(any(), any());

    assertThatCode(() -> publisher.orderCreated(order())).doesNotThrowAnyException();
    assertThatCode(() -> publisher.orderCreated(new Order())).doesNotThrowAnyException();
  }
}
