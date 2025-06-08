import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner"; // Make sure 'sonner' is installed and set up
import { addNotification } from './redux/Slice/notificationSlice';

const NotificationSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 10;
  const reconnectTimeoutId = useRef<number | null>(null);

  const connectWebSocket = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("✅ Notification WebSocket already open, skipping reconnection attempt.");
      return;
    }

    ws.current = new WebSocket("wss://brisbane.cloudhousetechnologies.com/booking/notification");

    ws.current.onopen = () => {
      console.log("✅ Notification WebSocket connected");
      reconnectAttempts.current = 0;
      if (reconnectTimeoutId.current) {
        clearTimeout(reconnectTimeoutId.current);
        reconnectTimeoutId.current = null;
      }
    };

    ws.current.onmessage = (event) => {
      try {
        dispatch(addNotification(event.data));
      } catch (err) {
        alert(`📢 ${event.data}`);
        console.warn("⚠️ Received non-JSON WebSocket message:", event.data);
      }
    };


    ws.current.onerror = (err) => {
      console.error("❌ Notification WebSocket error:", err);
    };

    ws.current.onclose = () => {
      console.log("🔌 Notification WebSocket disconnected");

      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        console.log(`Attempting to reconnect Notification WebSocket in ${delay / 1000} seconds... (Attempt ${reconnectAttempts.current})`);
        reconnectTimeoutId.current = window.setTimeout(connectWebSocket, delay);
      } else {
        console.warn("❌ Max reconnect attempts reached for Notification WebSocket. Not attempting to reconnect.");
        toast.error("Notification WebSocket connection lost. Please refresh the page if issues persist.");
      }
    };
  }, [dispatch]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeoutId.current) {
        clearTimeout(reconnectTimeoutId.current);
      }
    };
  }, [connectWebSocket]);

  return null;
};

export default NotificationSocket;