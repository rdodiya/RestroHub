package com.restroly.qrmenu.whatsapp.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.whatsapp.service.WhatsappOrderNotificationService;

import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
public class WhatsappOrderNotificationServiceImpl extends WhatsappServiceImpl implements WhatsappOrderNotificationService{
    @Value("${whatsapp.message.template.order-confirmation}")
    public  String orderConfirmation;
    @Value("${whatsapp.message.template.status-update}")
    public  String orderUpdateStatus;

    /**
     * Sends the initial order confirmation using an approved Meta Template.
     */
    @Async
    public void sendOrderConfirmation(OrderResponse order) {
        String templateName = orderConfirmation; // The exact name of your approved template in Meta

        // The parameters MUST be in the exact order as {{1}}, {{2}}, {{3}}, etc., in your Meta template
        List<Map<String, String>> bodyParameters = List.of(
                Map.of("type", "text", "text", order.getCustomerName()),                    // {{1}}
                Map.of("type", "text", "text", String.valueOf(order.getOrderId())),         // {{2}}
                Map.of("type", "text", "text", order.getBranchName()),                      // {{3}}
                Map.of("type", "text", "text", String.valueOf(order.getTableNumber())),     // {{4}}
                Map.of("type", "text", "text", order.getTotalAmount().toString()),          // {{5}}
                Map.of("type", "text", "text", order.getPaymentLink() != null ? order.getPaymentLink() : "Payment Due") // {{6}}
        );
        sendTemplateMessage(order.getCustomerPhone(), templateName, bodyParameters);
    }
    /**
     * Sends an update when the order status changes.
     */
    @Async
    public void sendOrderStatusUpdate(OrderResponse order) {
        String templateName = orderUpdateStatus;

        // The parameters MUST match the exact order of {{1}}, {{2}}, {{3}} in your Meta template
        List<Map<String, String>> bodyParameters = List.of(
                Map.of("type", "text", "text", String.valueOf(order.getOrderId())), // {{1}}
                Map.of("type", "text", "text", order.getCustomerName()),            // {{2}}
                Map.of("type", "text", "text", order.getStatus().name())            // {{3}}
        );

        sendTemplateMessage(order.getCustomerPhone(), templateName, bodyParameters);
    }
}
