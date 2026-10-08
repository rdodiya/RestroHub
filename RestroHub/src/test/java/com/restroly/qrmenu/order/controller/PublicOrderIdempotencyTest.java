package com.restroly.qrmenu.order.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.restroly.qrmenu.order.dto.CreateOrderRequest;
import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.service.OrderService;
import com.restroly.qrmenu.payment.service.PaymentService;
import com.restroly.qrmenu.whatsapp.service.WhatsappOrderNotificationService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;

/** Same Idempotency-Key must never create (or notify for) a second order. */
class PublicOrderIdempotencyTest {

  private final OrderService orders = mock(OrderService.class);
  private final WhatsappOrderNotificationService whatsapp =
      mock(WhatsappOrderNotificationService.class);
  private final PublicOrderController controller =
      new PublicOrderController(whatsapp, mock(PaymentService.class), orders);
  private final OrderResponse existing =
      OrderResponse.builder().orderId(7L).customerPhone("9999999999").build();

  private CreateOrderRequest request() {
    return CreateOrderRequest.builder().branchId(1L).tableId(1L).build();
  }

  @Test
  void repeatedKeyReturnsOriginalOrderWithoutCreatingOrNotifying() {
    when(orders.findByIdempotencyKey("k1")).thenReturn(Optional.of(existing));

    var res = controller.createCustomerOrder(request(), "k1");

    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertEquals(7L, res.getBody().getOrderId());
    verify(orders, never()).createOrder(any());
    verify(whatsapp, never()).sendOrderConfirmation(any());
  }

  @Test
  void concurrentTwinLosingTheRaceGetsTheWinnersOrder() {
    when(orders.findByIdempotencyKey("k2")).thenReturn(Optional.empty(), Optional.of(existing));
    when(orders.createOrder(any())).thenThrow(new DataIntegrityViolationException("uq"));

    var res = controller.createCustomerOrder(request(), "k2");

    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertEquals(7L, res.getBody().getOrderId());
    verify(whatsapp, never()).sendOrderConfirmation(any());
  }

  @Test
  void newKeyCreatesOrder() {
    when(orders.findByIdempotencyKey("k3")).thenReturn(Optional.empty());
    when(orders.createOrder(any())).thenReturn(existing);

    assertEquals(
        HttpStatus.CREATED, controller.createCustomerOrder(request(), "k3").getStatusCode());
  }
}
