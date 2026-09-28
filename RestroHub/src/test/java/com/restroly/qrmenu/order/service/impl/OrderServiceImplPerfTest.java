package com.restroly.qrmenu.order.service.impl;

import com.restroly.qrmenu.common.enums.OrderStatus;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.order.repository.OrderRepository;
import com.restroly.qrmenu.order.service.OrderNotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.util.StopWatch;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

public class OrderServiceImplPerfTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderNotificationService notificationService;

    @InjectMocks
    private OrderServiceImpl orderService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testMarkAllActiveOrdersReadyPerformance() {
        // Prepare 1000 orders
        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            Order order = new Order();
            order.setOrderId((long) i);
            order.setStatus(OrderStatus.PENDING);
            orders.add(order);
        }

        when(orderRepository.findActiveOrdersByBranch(anyLong(), any(List.class))).thenReturn(orders);
        when(orderRepository.saveAll(any())).thenAnswer(invocation -> invocation.getArgument(0));

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        orderService.markAllActiveOrdersReady(1L);

        stopWatch.stop();
        System.out.println("Time taken for 1000 orders (ms): " + stopWatch.getTotalTimeMillis());
    }
}