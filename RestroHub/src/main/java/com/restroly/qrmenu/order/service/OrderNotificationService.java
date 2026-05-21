package com.restroly.qrmenu.order.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.restroly.qrmenu.order.entity.Order;

public interface OrderNotificationService {
	void notifyNewOrder(Order order);
	void notifyOrderStatusChange(Order order);
	SseEmitter subscribe(Long branchId);
}