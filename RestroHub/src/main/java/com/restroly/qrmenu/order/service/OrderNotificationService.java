package com.restroly.qrmenu.order.service;

import com.restroly.qrmenu.notifications.service.SseGenericNotificationService;
import com.restroly.qrmenu.order.entity.Order;

@Service
@RequiredArgsConstructor
//@Slf4j
public class OrderNotificationService {

	private final SimpMessagingTemplate messagingTemplate;
	private final OrderMapper orderMapper;
	
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