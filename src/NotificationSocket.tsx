import { useEffect, useRef } from "react";

const NotificationSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 3;
  const retryDelay = 3000; // 3 seconds

  const connectWebSocket = () => {
    ws.current = new WebSocket("wss://brisbane.cloudhousetechnologies.com/booking/notification");
    
    ws.current.onopen = () => {
      console.log("🔔 WebSocket connected successfully");
      retryCount.current = 0; // Reset retry counter on successful connection
      
      // Optional: Send initial message if server requires it
      // ws.current?.send(JSON.stringify({ type: "subscribe" }));
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 Notification received:", data);
        
        if (data.message) {
          // Use a proper notification system instead of alert
          console.log("New notification:", data.message);
          // Or use a toast notification: toast.info(data.message);
        }
      } catch (err) {
        console.error("Failed to parse message:", err, "Raw data:", event.data);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = (event) => {
      console.log(`WebSocket closed (code: ${event.code}, reason: ${event.reason})`);
      
      // Reconnect logic
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        console.log(`Attempting to reconnect (${retryCount.current}/${maxRetries})...`);
        setTimeout(connectWebSocket, retryDelay);
      }
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        console.log("Cleaning up WebSocket connection");
        ws.current.close();
      }
    };
  }, []);

  return null;
};

export default NotificationSocket;