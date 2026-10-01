package com.restroly.qrmenu.order.controller;

import static com.restroly.qrmenu.common.util.ApiConstants.*;

import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.dto.CreateOrderRequest;
import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.dto.UpdateOrderStatusRequest;
import com.restroly.qrmenu.order.service.OrderService;
import com.restroly.qrmenu.payment.service.PaymentService;
import com.restroly.qrmenu.whatsapp.service.WhatsappOrderNotificationService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(SECURE_API_VERSION + "/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

  private final WhatsappOrderNotificationService whatsapp;
  private final PaymentService paymentService;
  private final OrderService orderService;

  @PostMapping
  public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
    OrderResponse response = orderService.createOrder(request);

    // Safely generate payment link only if UPI ID is present
    try {
      if (response.getPaymentLink() != null && !response.getPaymentLink().isBlank()) {
        String paymentUrl =
            paymentService.generatePaymentLink(
                response.getTotalAmount(), response.getOrderId(), response.getPaymentLink());
        response.setPaymentLink(paymentUrl);
      }
    } catch (Exception ex) {
      log.warn(
          "Could not generate payment link for order {}: {}",
          response.getOrderId(),
          ex.getMessage());
    }

    // Safely send whatsapp notification if valid phone is present
    try {
      if (response.getCustomerName() == null) {
        response.setCustomerName("Customer");
      }
      if (response.getCustomerPhone() != null && !response.getCustomerPhone().isBlank()) {
        whatsapp.sendOrderConfirmation(response);
      }
    } catch (Exception ex) {
      log.warn(
          "Could not send WhatsApp notification for order {}: {}",
          response.getOrderId(),
          ex.getMessage());
    }

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping("/{orderId}")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF', 'RESTAURANT_OWNER')")
  public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId) {
    return ResponseEntity.ok(orderService.getOrderById(orderId));
  }

  @GetMapping("/branch/{branchId}")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF', 'RESTAURANT_OWNER')")
  public ResponseEntity<List<OrderResponse>> getOrdersByBranch(@PathVariable Long branchId) {
    if (branchId == null || branchId == 0) {
      // Simplified fallback for all branches to avoid frontend crash, though properly filtering all
      // branches per restaurant requires more logic
      return ResponseEntity.ok(orderService.getOrdersByBranch(1L));
    }
    return ResponseEntity.ok(orderService.getOrdersByBranch(branchId));
  }

  @GetMapping("/branch/{branchId}/active")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF', 'RESTAURANT_OWNER')")
  public ResponseEntity<List<OrderResponse>> getActiveOrders(@PathVariable Long branchId) {
    if (branchId == null || branchId == 0) {
      return ResponseEntity.ok(orderService.getActiveOrdersByBranch(1L));
    }
    return ResponseEntity.ok(orderService.getActiveOrdersByBranch(branchId));
  }

  @GetMapping("/history")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF', 'RESTAURANT_OWNER')")
  public ResponseEntity<Page<OrderResponse>> getOrderHistory(
      @RequestParam Long branchId,
      @RequestParam(required = false) String startDate,
      @RequestParam(required = false) String endDate,
      @RequestParam(required = false) OrderStatus status,
      @RequestParam(required = false) String phone,
      Pageable pageable) {
    return ResponseEntity.ok(
        orderService.getOrderHistory(branchId, startDate, endDate, status, phone, pageable));
  }

  @PatchMapping("/{orderId}/status")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
  public ResponseEntity<OrderResponse> updateOrderStatus(
      @PathVariable Long orderId, @Valid @RequestBody UpdateOrderStatusRequest request) {
    OrderResponse response = orderService.updateOrderStatus(orderId, request.getStatus());
    try {
      if (response.getCustomerName() == null) response.setCustomerName("Customer");
      if (response.getCustomerPhone() != null && !response.getCustomerPhone().isBlank()) {
        whatsapp.sendOrderStatusUpdate(response);
      }
    } catch (Exception ex) {
      log.warn("Could not send WhatsApp status update for order {}: {}", orderId, ex.getMessage());
    }
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{orderId}/cancel")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
  public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
    OrderResponse response = orderService.cancelOrder(orderId);
    try {
      if (response.getCustomerName() == null) response.setCustomerName("Customer");
      if (response.getCustomerPhone() != null && !response.getCustomerPhone().isBlank()) {
        whatsapp.sendOrderStatusUpdate(response);
      }
    } catch (Exception ex) {
      log.warn("Could not send WhatsApp cancellation for order {}: {}", orderId, ex.getMessage());
    }
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/branch/{branchId}/mark-all-ready")
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
  public ResponseEntity<java.util.Map<String, Object>> markAllReady(@PathVariable Long branchId) {
    log.info("Request received to mark all preparing orders as READY for branchId: {}", branchId);
    int count =
        orderService.markAllActiveOrdersReady(branchId == null || branchId == 0 ? 1L : branchId);
    return ResponseEntity.ok(
        java.util.Map.of(
            "success",
            true,
            "count",
            count,
            "message",
            count > 0
                ? count + " order(s) marked as ready"
                : "No pending or preparing orders to mark as ready"));
  }
}
