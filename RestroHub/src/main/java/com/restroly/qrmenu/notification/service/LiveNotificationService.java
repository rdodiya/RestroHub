package com.restroly.qrmenu.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Generic, reusable live notification broadcaster.
 * Wraps SimpMessagingTemplate to provide a clean API for broadcasting
 * real-time events via WebSocket to any destination.
 *
 * Usage:
 *   liveNotificationService.broadcast("/topic/orders/branch/1", orderResponse);
 *   liveNotificationService.broadcast("/topic/service-requests/branch/1", serviceRequestResponse);
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LiveNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast a payload to a specific WebSocket destination.
     *
     * @param destination the STOMP topic destination (e.g., "/topic/service-requests/branch/1")
     * @param payload     the object to send (will be serialized to JSON)
     * @param <T>         type of the payload
     */
    public <T> void broadcast(String destination, T payload) {
        log.info("Broadcasting to {}: {}", destination, payload);
        messagingTemplate.convertAndSend(destination, payload);
    }
}
