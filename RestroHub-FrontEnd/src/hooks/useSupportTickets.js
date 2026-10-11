import { useState, useEffect, useCallback } from 'react';
import api from '@services/common/api';

const POLL_MS = 60000;

const relativeTime = (iso) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return new Date(iso).toLocaleDateString();
};

// Open Help & Support tickets for the superadmin's notification bell.
const useSupportTickets = (enabled) => {
  const [notifications, setNotifications] = useState([]);

  const load = useCallback(async () => {
    try {
      const res = await api.get('/secure/api/v1/admin/support-tickets');
      setNotifications(
        res.data.map((t) => ({
          id: t.id,
          title: t.title,
          desc: `${t.userName || t.userEmail}${t.restaurantName ? ` \u2022 ${t.restaurantName}` : ''}`,
          detail: t.message,
          time: relativeTime(t.createdAt),
          unread: true,
        }))
      );
    } catch (err) {
      console.warn('Failed to load support tickets:', err);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    load();
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [enabled, load]);

  const resolve = useCallback(async (id) => {
    await api.post(`/secure/api/v1/admin/support-tickets/${id}/resolve`);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notifications, unreadCount: notifications.length, resolve };
};

export default useSupportTickets;
