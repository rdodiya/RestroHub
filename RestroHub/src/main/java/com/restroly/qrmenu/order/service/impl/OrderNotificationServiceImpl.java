package com.restroly.qrmenu.order.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.restroly.qrmenu.order.dto.OrderResponse;
import com.restroly.qrmenu.order.entity.Order;
import com.restroly.qrmenu.order.mapper.OrderMapper;
import com.restroly.qrmenu.order.service.OrderNotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderNotificationServiceImpl implements OrderNotificationService{
    //Required : real cache or database to store emitters for scalability and reliability
    private final Map<Long,List<SseEmitter>> branchEmitters = new ConcurrentHashMap<>();
    private final OrderMapper orderMapper;

    private void removeEmitter(Long branchId,SseEmitter emitter){
        List<SseEmitter> emitters = branchEmitters.get(branchId);
        if(emitters == null) return;
        emitters.remove(emitter);
        if(emitters.isEmpty()) {
            branchEmitters.remove(branchId);
        }
    }

    private void broadcast(Long branchId, Object dto,String eventName){
        List<SseEmitter> emitters = branchEmitters.getOrDefault(branchId, new CopyOnWriteArrayList<>());
        for(SseEmitter emitter:emitters){
            try {
                emitter.send(SseEmitter.event()
                                        .name(eventName)
                                        .data(dto)
                                        );
            } catch (IOException e) {
                emitter.completeWithError(e);
                removeEmitter(branchId, emitter);
            }
        }
    }

//Currently unicast is not in use but can be used for targeted notifications || KEPT FOR FUTURE USE
    private void unicast(Long branchId,SseEmitter emitter,Object dto,String eventName){
        try {
                emitter.send(SseEmitter.event()
                                        .name(eventName)
                                        .data(dto)
                                        );
            } catch (IOException e) {
                emitter.completeWithError(e);
                removeEmitter(branchId, emitter);
        }
    }

    @Override
    public SseEmitter subscribe(Long branchId){
        // log.info("Initiating notifications for branch: {}", branchId);
        SseEmitter emitter = new SseEmitter(1800000L);// 30 min timeout
        branchEmitters.computeIfAbsent(branchId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        emitter.onCompletion(() -> removeEmitter(branchId,emitter));
        emitter.onTimeout(() -> removeEmitter(branchId,emitter));
        emitter.onError((e) -> removeEmitter(branchId,emitter));
        // log.info("Sending notifications for branch: {}", branchId);
        return emitter;
    }

    @Override
    public void notifyNewOrder(Order order) {
        OrderResponse response = orderMapper.toResponse(order);
        broadcast(order.getBranch().getBranchId(), response, "NEW_ORDER");
        // log.info("Notification sent for new order: {}", order.getOrderId());
    }

    @Override
    public void notifyOrderStatusChange(Order order) {
        Map<String,?> response = Map.of(
            "orderId", order.getOrderId(),
            "status", order.getStatus()
        );
        broadcast(order.getBranch().getBranchId(), response, "STATUS_UPDATE");
        // log.info("Notification sent for order status update: {}", order.getOrderId());
    }
}