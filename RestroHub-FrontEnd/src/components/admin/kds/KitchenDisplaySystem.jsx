import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from '@services/common/api';
import KanbanBoard from './KanbanBoard';
import toast from 'react-hot-toast';

const KitchenDisplaySystem = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef(null);
  const audioContextRef = useRef(null);

  const branchId = localStorage.getItem("selectedBranchId") || 1;

  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playChime = () => {
    if (!audioContextRef.current) return;

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioContextRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880.00, audioContextRef.current.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 1);

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 1);
    } catch (e) {
      console.error("Audio playback failed", e);
      toast.error("Audio playback failed");
    }
  };

  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/secure/api/v1/orders/branch/${branchId}/active`);
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load active orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();

    const connectWebSocket = () => {
      const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:8181/ws";
      const socket = new SockJS(wsUrl);
      const client = Stomp.over(socket);

      client.debug = () => {};

      client.connect({}, (frame) => {
        setIsConnected(true);
        console.log('Connected to KDS WebSocket');

        client.subscribe(`/topic/orders/branch/${branchId}`, (message) => {
          if (message.body) {
            const notification = JSON.parse(message.body);
            handleOrderNotification(notification);
          }
        });
      }, (error) => {
        console.error('WebSocket error:', error);
        toast.error('WebSocket error');
        setIsConnected(false);
        setTimeout(connectWebSocket, 5000);
      });

      stompClientRef.current = client;
    };

    connectWebSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, [branchId]);

  const handleOrderNotification = (notification) => {
    const { type, order } = notification;

    if (type === 'NEW_ORDER') {
      playChime();
      toast.success(`New order #${order.orderId} received!`, { icon: '🔔' });
      setOrders(prev => {
        if (prev.some(o => o.orderId === order.orderId)) return prev;
        return [order, ...prev];
      });
    } else if (type === 'STATUS_UPDATE') {
      setOrders(prev => prev.map(o => o.orderId === order.orderId ? order : o));
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(o =>
      o.orderId === orderId ? { ...o, status: newStatus } : o
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4 pt-20 lg:pt-4">
      <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kitchen Display System</h1>
          <div className="flex items-center mt-1">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
            <span className="text-sm text-gray-500 font-medium">
              {isConnected ? 'Live Sync Active' : 'Disconnected - Reconnecting...'}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchActiveOrders}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <KanbanBoard orders={orders} onStatusUpdate={handleStatusUpdate} />
        )}
      </div>
    </div>
  );
};

export default KitchenDisplaySystem;
