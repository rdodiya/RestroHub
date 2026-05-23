package com.restroly.qrmenu.order.service.impl;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.restroly.qrmenu.notifications.service.impl.AbstractSseNotificationService;
import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.order.mapper.OrderMapper;
import com.restroly.qrmenu.order.service.OrderNotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderNotificationServiceImpl extends AbstractSseNotificationService<Long, Object> implements OrderNotificationService {

    private final OrderMapper orderMapper;

    @Override
    public void notifyNewOrder(Order order) {
        OrderResponse response = orderMapper.toResponse(order);
        broadcast(order.getBranch().getBranchId(), response, "NEW_ORDER");
    }

    @Override
    public void notifyOrderStatusChange(Order order) {
        Map<String, Object> response = Map.of(
            "orderId", order.getOrderId(),
            "status", order.getStatus()
        );
        broadcast(order.getBranch().getBranchId(), response, "STATUS_UPDATE");
    }
}