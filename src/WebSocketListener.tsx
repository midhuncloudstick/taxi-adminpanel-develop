import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addAlert } from "./redux/Slice/notificationSlice";
import { useAuth } from "./hooks/useAuth"; // Ensure this path is correct

const WebSocketListener = () => {
  const ws = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 10; // Maximum attempts before giving up
  const reconnectTimeoutId = useRef<number | null>(null); // To store the timeout ID for cleanup

  // ✅ Get isAuthenticated directly from your useAuth hook
  const { isAuthenticated } = useAuth();

  // Function to establish the WebSocket connection
  const connectWebSocket = useCallback(() => {
    // 🚫 IMPORTANT: Do NOT connect if not authenticated
    if (!isAuthenticated) {
      console.log("🚫 Not authenticated, skipping WebSocket connection attempt.");
      // Ensure any existing connection is closed if authentication is lost
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
        console.log("🚫 Closing existing WebSocket connection due to deauthentication.");
      }
      return;
    }

    // If a connection already exists and is open, no need to reconnect
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("✅ Event WebSocket already open, skipping reconnection attempt.");
      return;
    }

    ws.current = new WebSocket("wss://brisbane.cloudhousetechnologies.com/ws/events");

    ws.current.onopen = () => {
      console.log("✅ Event WebSocket connected");
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
        // Dispatch the alert to Redux
        if (data.bookings) {
          dispatch(addAlert(data.bookings));
        } else {
          console.warn("⚠️ Received event data without 'bookings' property:", data);
        }
      } catch (err) {
        console.warn("⚠️ Received non-JSON WebSocket message:", event.data);
        // Optionally, you could dispatch a generic alert or show a toast for non-JSON messages
        // toast.warning(`Received unexpected message: ${event.data}`);
      }
    };

    ws.current.onerror = (err) => {
      console.error("❌ Event WebSocket error:", err);
      // The 'onclose' event usually follows an 'onerror' event,
      // so reconnection logic is primarily handled in 'onclose'.
    };

    ws.current.onclose = () => {
      console.log("🔌 Event WebSocket disconnected");

      // ✅ Only attempt to reconnect if still authenticated and within limits
      if (isAuthenticated && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current++;
        // Exponential backoff: delay increases with each attempt
        // Formula: min(1000 * (2^attempt), 30000) - max 30 seconds delay
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        console.log(`Attempting to reconnect Event WebSocket in ${delay / 1000} seconds... (Attempt ${reconnectAttempts.current})`);
        reconnectTimeoutId.current = window.setTimeout(connectWebSocket, delay);
      } else if (!isAuthenticated) {
        // If deauthenticated, stop trying to reconnect
        console.log("🚫 Not authenticated, not attempting to reconnect WebSocket.");
        if (reconnectTimeoutId.current) {
          clearTimeout(reconnectTimeoutId.current);
          reconnectTimeoutId.current = null;
        }
      } else {
        console.warn("❌ Max reconnect attempts reached for Event WebSocket. Not attempting to reconnect.");
        toast.error("Event WebSocket connection lost. Please refresh the page if issues persist.");
      }
    };
  }, [dispatch, isAuthenticated]); // ✅ isAuthenticated MUST be in the dependency array

  useEffect(() => {
    // This effect runs whenever `isAuthenticated` or `connectWebSocket` changes.
    // This is the primary control for the WebSocket lifecycle.
    if (isAuthenticated) {
      connectWebSocket(); // Attempt to connect if authenticated
    } else {
      // If not authenticated, ensure the WebSocket is closed
      if (ws.current) {
        ws.current.close();
        console.log("🔌 WebSocket closed due to user logout/deauthentication.");
      }
      // Also clear any pending reconnect timeouts if user logs out
      if (reconnectTimeoutId.current) {
        clearTimeout(reconnectTimeoutId.current);
        reconnectTimeoutId.current = null;
      }
    }

    // Cleanup function for when the component unmounts or dependencies change
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeoutId.current) {
        clearTimeout(reconnectTimeoutId.current);
      }
    };
  }, [isAuthenticated, connectWebSocket]); // ✅ Both are crucial dependencies here

  // The component doesn't render any UI, so it returns null
  return null;
};

export default WebSocketListener;