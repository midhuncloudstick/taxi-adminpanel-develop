import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { updatelist } from "./redux/Slice/bookingSlice";

const BookingWebsocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 10; // Maximum attempts before giving up
  const reconnectTimeoutId = useRef<number | null>(null); // To store the timeout ID for cleanup

  // Function to establish the WebSocket connection
  const connectWebSocket = useCallback(() => {
    // If a connection already exists and is open, no need to reconnect
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("✅ Booking WebSocket already open, skipping reconnection attempt.");
      return;
    }

    ws.current = new WebSocket("wss://brisbane.cloudhousetechnologies.com/ws/bookings");

    ws.current.onopen = () => {
      console.log("✅ Booking WebSocket connected");
      reconnectAttempts.current = 0; // Reset attempts on successful connection
      // Clear any pending reconnect timeouts
      if (reconnectTimeoutId.current) {
        clearTimeout(reconnectTimeoutId.current);
        reconnectTimeoutId.current = null;
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        dispatch(updatelist(data));
      } catch (err) {
        console.warn("⚠️ Received non-JSON WebSocket message:", event.data);
      }
    };

    ws.current.onerror = (err) => {
      console.error("❌ Booking WebSocket error:", err);
      // The 'onclose' event usually follows an 'onerror' event,
      // so reconnection logic is primarily handled in 'onclose'.
    };

    ws.current.onclose = () => {
      console.log("🔌 Booking WebSocket disconnected");

      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current++;
        // Exponential backoff: delay increases with each attempt
        // Formula: min(1000 * (2^attempt), 30000) - max 30 seconds delay
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        console.log(`Attempting to reconnect Booking WebSocket in ${delay / 1000} seconds... (Attempt ${reconnectAttempts.current})`);
        reconnectTimeoutId.current = window.setTimeout(connectWebSocket, delay);
      } else {
        console.warn("❌ Max reconnect attempts reached for Booking WebSocket. Not attempting to reconnect.");
        toast.error("Booking WebSocket connection lost. Please refresh the page if issues persist.");
      }
    };
  }, [dispatch]); // `dispatch` is stable and doesn't cause re-renders

  useEffect(() => {
    // Establish the initial connection when the component mounts
    connectWebSocket();

    // Cleanup function: close the WebSocket and clear any pending timeouts
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeoutId.current) {
        clearTimeout(reconnectTimeoutId.current);
      }
    };
  }, [connectWebSocket]); // Re-run effect if connectWebSocket function changes (which it won't due to useCallback)

  // The component doesn't render any UI, so it returns null
  return null;
};

export default BookingWebsocket;