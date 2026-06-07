package com.restroly.qrmenu.notifications.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface SseGenericNotificationService<K ,T> {
    
    SseEmitter subscribe(K topicId);

    void broadcast(K topicId, T payload, String eventName);

    void unicast(K topicId, SseEmitter emitter, T payload, String eventName);

    void removeEmitter(K topicId, SseEmitter emitter);

    void closeConnections(K topicId);
}
