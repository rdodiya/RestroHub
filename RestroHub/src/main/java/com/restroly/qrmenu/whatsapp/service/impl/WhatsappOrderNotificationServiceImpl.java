package com.restroly.qrmenu.whatsapp.service.impl;

import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.whatsapp.service.WhatsappOrderNotificationService;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class WhatsappOrderNotificationServiceImpl extends WhatsappServiceImpl
    implements WhatsappOrderNotificationService {
  @Autowired
  public WhatsappOrderNotificationServiceImpl(RestTemplateBuilder builder) {
    super(builder);
  }

  @Value("${whatsapp.message.template.order-confirmation}")
  public String orderConfirmation;

  @Value("${whatsapp.message.template.status-update}")
  public String orderUpdateStatus;

  /** Sends the initial order confirmation using an approved Meta Template. */
  @Async
  public void sendOrderConfirmation(OrderResponse order) {
    String templateName = orderConfirmation; // The exact name of your approved template in Meta

    // The parameters MUST be in the exact order as {{1}}, {{2}}, {{3}}, etc., in your Meta template
    // 2026-11-07 - NPE on null order fields in Map.of - Fallback null fields safely
    List<Map<String, String>> bodyParameters =
        List.of(
            Map.of(
                "type",
                "text",
                "text",
                order.getCustomerName() != null ? order.getCustomerName() : "Customer"),
            Map.of(
                "type",
                "text",
                "text",
                String.valueOf(order.getOrderId() != null ? order.getOrderId() : "")),
            Map.of(
                "type",
                "text",
                "text",
                order.getBranchName() != null ? order.getBranchName() : "RestroHub"),
            Map.of(
                "type",
                "text",
                "text",
                String.valueOf(
                    order.getTableNumber() != null ? order.getTableNumber() : "Counter")),
            Map.of(
                "type",
                "text",
                "text",
                order.getTotalAmount() != null ? order.getTotalAmount().toString() : "0.00"),
            Map.of(
                "type",
                "text",
                "text",
                order.getPaymentLink() != null ? order.getPaymentLink() : "Payment Due"));
    sendTemplateMessage(order.getCustomerPhone(), templateName, bodyParameters);
  }

  /** Sends an update when the order status changes. */
  @Async
  public void sendOrderStatusUpdate(OrderResponse order) {
    String templateName = orderUpdateStatus;

    // The parameters MUST match the exact order of {{1}}, {{2}}, {{3}} in your Meta template
    // 2026-11-07 - NPE on null order fields in Map.of - Fallback null fields safely
    List<Map<String, String>> bodyParameters =
        List.of(
            Map.of(
                "type",
                "text",
                "text",
                String.valueOf(order.getOrderId() != null ? order.getOrderId() : "")),
            Map.of(
                "type",
                "text",
                "text",
                order.getCustomerName() != null ? order.getCustomerName() : "Customer"),
            Map.of(
                "type",
                "text",
                "text",
                order.getStatus() != null ? order.getStatus().name() : "UPDATED"));

    sendTemplateMessage(order.getCustomerPhone(), templateName, bodyParameters);
  }
}
