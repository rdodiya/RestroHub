package com.restroly.qrmenu.order.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.restroly.qrmenu.order.dto.CreateOrderRequest;
import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.service.OrderService;
import com.restroly.qrmenu.payment.service.PaymentService;
import com.restroly.qrmenu.whatsapp.service.WhatsappOrderNotificationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.restroly.qrmenu.common.util.ApiConstants.PUBLIC_API_VERSION;

@RestController
@RequestMapping(PUBLIC_API_VERSION + "/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Public Order API", description = "Public APIs for table customers to place dine-in orders")
public class PublicOrderController {

    @Autowired(required = false)
    private final WhatsappOrderNotificationService whatsapp;

    private final PaymentService paymentService;
    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create an order from customer QR menu", description = "Places an order tied to branchId and tableId without requiring admin authentication")
    public ResponseEntity<OrderResponse> createCustomerOrder(@Valid @RequestBody CreateOrderRequest request) {
        log.info("Received public table order request for branch: {}, table: {}", request.getBranchId(), request.getTableId());
        OrderResponse response = orderService.createOrder(request);

        if (response.getTotalAmount() != null && response.getOrderId() != null) {
            String paymentUrl = paymentService.generatePaymentLink(
                    response.getTotalAmount(),
                    response.getOrderId(),
                    response.getPaymentLink()
            );
            response.setPaymentLink(paymentUrl);
        }

        if (response.getCustomerName() == null) {
            response.setCustomerName("Customer");
        }
        if (response.getCustomerPhone() != null && whatsapp != null) {
            try {
                whatsapp.sendOrderConfirmation(response);
            } catch (Exception e) {
                log.warn("Failed to send WhatsApp order confirmation: {}", e.getMessage());
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
