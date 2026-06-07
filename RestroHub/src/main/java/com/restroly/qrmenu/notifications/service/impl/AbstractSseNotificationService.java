package com.restroly.qrmenu.notifications.service.impl;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.restroly.qrmenu.notifications.service.SseGenericNotificationService;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
public abstract class AbstractSseNotificationService<K, T> implements SseGenericNotificationService<K,T> {

    // K represents the topic/group (e.g., branchId)
    protected final Map<K, List<SseEmitter>> emittersMap = new ConcurrentHashMap<>();

    @Override
    public SseEmitter subscribe(K topicId) {
        SseEmitter emitter = new SseEmitter(1800000L); // 30 min timeout
        
        emittersMap.computeIfAbsent(topicId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        
        emitter.onCompletion(() -> removeEmitter(topicId, emitter));
        emitter.onTimeout(() -> removeEmitter(topicId, emitter));
        emitter.onError((e) -> removeEmitter(topicId, emitter));
        
        return emitter;
    }

    @Override
    public void broadcast(K topicId, T payload, String eventName) {
        List<SseEmitter> emitters = emittersMap.getOrDefault(topicId, new CopyOnWriteArrayList<>());
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(payload));
            } catch (IOException e) {
                emitter.completeWithError(e);
                removeEmitter(topicId, emitter);
            }
        }
    }
    //keep for future use if you send notifications to specific people
    @Override
    public void unicast(K topicId, SseEmitter emitter, T payload, String eventName) {
        try {
            emitter.send(SseEmitter.event()
                    .name(eventName)
                    .data(payload));
        } catch (IOException e) {
            emitter.completeWithError(e);
            removeEmitter(topicId, emitter);
        }
    }

    @Override
    public void removeEmitter(K topicId, SseEmitter emitter) {
        List<SseEmitter> emitters = emittersMap.get(topicId);
        if (emitters == null) return;
        
        emitters.remove(emitter);
        if (emitters.isEmpty()) {
            emittersMap.remove(topicId);
        }
    }

    @Override
    public void closeConnections(K topicId) {
        List<SseEmitter> emitters = emittersMap.get(topicId);
        if (emitters != null) {
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.complete(); // Tells Spring to cleanly sever the HTTP response
                } catch (Exception e) {
                    log.error("Failed to cleanly complete emitter for topic {}", topicId, e);
                }
            }
            emittersMap.remove(topicId);
            log.info("Forcefully closed all SSE connections for topic: {}", topicId);
        }
    }
}
