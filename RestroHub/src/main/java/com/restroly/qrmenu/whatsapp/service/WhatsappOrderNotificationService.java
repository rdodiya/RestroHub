package com.restroly.qrmenu.whatsapp.service;

import com.restroly.qrmenu.order.dto.OrderResponse;

public interface WhatsappOrderNotificationService{
    void sendOrderConfirmation(OrderResponse order);
    void sendOrderStatusUpdate(OrderResponse order);
}
