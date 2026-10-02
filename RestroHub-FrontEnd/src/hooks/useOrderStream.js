import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import api from '@services/common/api';
import { useBranch } from '@context/BranchContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8181/restroly';
const POLL_MS = 15000;

let audioCtx;
/** Short chime; silently ignored when the browser blocks autoplay or Web Audio is missing. */
export const playChime = () => {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = audioCtx || new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.1);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 1);
  } catch {
    // autoplay blocked or audio unavailable
  }
};

let restaurantIdPromise;
const getRestaurantId = () => {
  restaurantIdPromise =
    restaurantIdPromise ||
    api
      .get('/secure/api/v1/users/fetchRestaurantId')
      .then((r) => r.data?.restaurantId ?? null)
      .catch(() => {
        restaurantIdPromise = null;
        return null;
      });
  return restaurantIdPromise;
};

/**
 * Subscribes to the live order topic of the active branch. `onChange(order)` is called on every
 * message (chime on new PENDING orders) and, while disconnected, every 15s with no argument so the
 * caller can refetch.
 */
const useOrderStream = (onChange) => {
  const { effectiveBranchId } = useBranch();
  const [connected, setConnected] = useState(false);
  const cb = useRef(onChange);
  useEffect(() => {
    cb.current = onChange;
  });

  useEffect(() => {
    if (!effectiveBranchId) return undefined;
    let client;
    let poll;
    let cancelled = false;

    const startPolling = () => {
      if (!poll) poll = setInterval(() => cb.current?.(), POLL_MS);
    };
    const stopPolling = () => {
      clearInterval(poll);
      poll = null;
    };

    startPolling(); // until the socket is up
    getRestaurantId().then((restaurantId) => {
      if (cancelled || !restaurantId) return;
      client = new Client({
        webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
        reconnectDelay: 5000,
        onConnect: () => {
          setConnected(true);
          stopPolling();
          client.subscribe(
            `/topic/restaurant/${restaurantId}/branch/${effectiveBranchId}/orders`,
            (msg) => {
              let order = null;
              try {
                order = JSON.parse(msg.body);
              } catch {
                // non-JSON payload: just refetch
              }
              if (order?.status === 'PENDING') playChime();
              cb.current?.(order);
            }
          );
        },
        onWebSocketClose: () => {
          setConnected(false);
          startPolling();
        },
      });
      client.activate();
    });

    return () => {
      cancelled = true;
      stopPolling();
      setConnected(false);
      client?.deactivate();
    };
  }, [effectiveBranchId]);

  return { connected };
};

export default useOrderStream;
