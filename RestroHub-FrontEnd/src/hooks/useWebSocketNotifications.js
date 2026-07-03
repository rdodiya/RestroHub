import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import toast from 'react-hot-toast';
import { getAccessToken } from '@/utils/authTokenStorage';

// ============================================
// useWebSocketNotifications Hook
// Connects to backend WebSocket and provides
// live service request notifications for admin
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8181/restroly';
const WS_URL = `${API_BASE_URL}/ws`;

/**
 * Helper to compute relative time (e.g., "2m ago")
 */
const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString();
};

/**
 * Map a service request to a notification object
 */
const mapToNotification = (request) => {
    const typeLabel = request.requestType === 'CALL_WAITER' ? '🔔 Call Waiter' : '💳 Request Bill';
    return {
        id: request.id,
        title: `${typeLabel} — Table ${request.tableNumber}`,
        desc: `Branch #${request.branchId} • ${request.requestType.replace('_', ' ')}`,
        time: getRelativeTime(request.createdAt),
        unread: request.status === 'PENDING',
        raw: request,
    };
};

const useWebSocketNotifications = (branchId) => {
    const [notifications, setNotifications] = useState([]);
    const clientRef = useRef(null);
    const timerRef = useRef(null);

    // Fetch existing PENDING requests on mount
    useEffect(() => {
        if (!branchId) return;

        const fetchExisting = async () => {
            try {
                const token = getAccessToken();
                const res = await fetch(
                    `${API_BASE_URL}/secure/api/v1/service-requests/branch/${branchId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data.map(mapToNotification));
                }
            } catch (err) {
                console.warn('Failed to fetch existing service requests:', err);
            }
        };

        fetchExisting();
    }, [branchId]);

    // Connect to WebSocket
    useEffect(() => {
        if (!branchId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            reconnectDelay: 5000,
            debug: (str) => {
                // Uncomment for debugging: console.log('STOMP:', str);
            },
            onConnect: () => {
                console.log('WebSocket connected for service requests');
                client.subscribe(
                    `/topic/service-requests/branch/${branchId}`,
                    (message) => {
                        const request = JSON.parse(message.body);
                        const notif = mapToNotification(request);
                        setNotifications((prev) => [notif, ...prev]);

                        // Display a beautiful real-time toast alert to the admin!
                        const label = request.requestType === 'CALL_WAITER' ? 'Call Waiter' : 'Request Bill';
                        toast(`${label} — Table ${request.tableNumber}`, {
                            icon: request.requestType === 'CALL_WAITER' ? '🔔' : '💳',
                            duration: 5000,
                        });
                    }
                );
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers['message']);
            },
        });

        client.activate();
        clientRef.current = client;

        // Refresh relative times every 60 seconds
        timerRef.current = setInterval(() => {
            setNotifications((prev) =>
                prev.map((n) => ({
                    ...n,
                    time: getRelativeTime(n.raw.createdAt),
                }))
            );
        }, 60000);

        return () => {
            if (clientRef.current) clientRef.current.deactivate();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [branchId]);

    // Acknowledge a request
    const acknowledgeRequest = useCallback(async (requestId) => {
        try {
            const token = getAccessToken();
            await fetch(
                `${API_BASE_URL}/secure/api/v1/service-requests/${requestId}/acknowledge`,
                { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === requestId ? { ...n, unread: false } : n
                )
            );
        } catch (err) {
            console.error('Failed to acknowledge request:', err);
        }
    }, []);

    // Complete/dismiss a request
    const completeRequest = useCallback(async (requestId) => {
        try {
            const token = getAccessToken();
            await fetch(
                `${API_BASE_URL}/secure/api/v1/service-requests/${requestId}/complete`,
                { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications((prev) => prev.filter((n) => n.id !== requestId));
        } catch (err) {
            console.error('Failed to complete request:', err);
        }
    }, []);

    const unreadCount = notifications.filter((n) => n.unread).length;

    return { notifications, unreadCount, acknowledgeRequest, completeRequest };
};

export default useWebSocketNotifications;
