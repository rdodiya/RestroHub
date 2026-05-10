//com/Restroly/qrmenu/order/service/OrderNotificationService.java
package com.restroly.qrmenu.order.service;

import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.order.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
//@Slf4j
public class OrderNotificationService {

//	private final SimpMessagingTemplate messagingTemplate;
//	private final OrderMapper orderMapper;

	private final SimpMessagingTemplate messagingTemplate = null;
	private final OrderMapper orderMapper = new OrderMapper();
	
	public void notifyNewOrder(Order order) {
		OrderResponse response = orderMapper.toResponse(order);
		String destination = "/topic/orders/branch/" + order.getBranch().getBranchId();

		messagingTemplate.convertAndSend(destination, new OrderNotification("NEW_ORDER", response));

//     log.info("Notification sent for new order: {}", order.getOrderId());
	}

	public void notifyOrderStatusChange(Order order) {
		OrderResponse response = orderMapper.toResponse(order);
		String destination = "/topic/orders/branch/" + order.getBranch().getBranchId();

		messagingTemplate.convertAndSend(destination, new OrderNotification("STATUS_UPDATE", response));

//     log.info("Status update notification sent for order: {}", order.getOrderId());
	}

	public record OrderNotification(String type, OrderResponse order) {
	}
}