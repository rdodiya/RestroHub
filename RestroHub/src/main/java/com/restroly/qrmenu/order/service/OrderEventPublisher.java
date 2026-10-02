package com.restroly.qrmenu.order.service;

import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.notification.service.LiveNotificationService;
import com.restroly.qrmenu.order.entity.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Broadcasts order create/status events to the branch's STOMP topic. The payload is deliberately
 * tiny (no amounts, items or customer data) so any role subscribed to the topic can receive it.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventPublisher {

  private final LiveNotificationService liveNotificationService;

  /** Small, financial-free event payload. */
  public record OrderEvent(
      String type,
      Long orderId,
      String reference,
      OrderStatus status,
      Integer tableNumber,
      Long branchId) {}

  /** Publishes an ORDER_CREATED event; never throws. */
  public void orderCreated(Order order) {
    publish("ORDER_CREATED", order);
  }

  /** Publishes an ORDER_STATUS_CHANGED event; never throws. */
  public void orderStatusChanged(Order order) {
    publish("ORDER_STATUS_CHANGED", order);
  }

  /** Topic for a branch's order events. */
  public static String topic(Long restaurantId, Long branchId) {
    return "/topic/restaurant/" + restaurantId + "/branch/" + branchId + "/orders";
  }

  private void publish(String type, Order order) {
    try {
      Long branchId = order.getBranch().getBranchId();
      Long restaurantId = order.getBranch().getRestaurant().getRestId();
      OrderEvent event =
          new OrderEvent(
              type,
              order.getOrderId(),
              "ORD-" + order.getOrderId(),
              order.getStatus(),
              order.getTable() == null ? null : order.getTable().getTableNumber(),
              branchId);
      liveNotificationService.broadcast(topic(restaurantId, branchId), event);
    } catch (Exception ex) {
      log.warn(
          "Could not broadcast {} for order {}: {}", type, order.getOrderId(), ex.getMessage());
    }
  }
}
