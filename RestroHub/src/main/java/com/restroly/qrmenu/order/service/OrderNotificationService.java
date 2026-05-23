package com.restroly.qrmenu.order.service;

import com.restroly.qrmenu.notifications.service.SseGenericNotificationService;
import com.restroly.qrmenu.order.entity.Order;

public interface OrderNotificationService extends SseGenericNotificationService<Long, Object>{
	void notifyNewOrder(Order order);
	void notifyOrderStatusChange(Order order);
}