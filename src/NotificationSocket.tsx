import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type?: string;
  data?: any;
  message?: string;
}

const useNotificationWebSocket = () => {
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const retryCount = useRef(0);
  const maxRetries = 5;
  const retryDelay = useRef(1000); // Start with 1 second delay
  const pingInterval = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    // Cleanup previous connection if exists
    if (socket.current) {
      socket.current.close();
    }

    const wsUrl = 'wss://brisbane.cloudhousetechnologies.com/booking/notification';
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    
    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = () => {
      console.log('WebSocket connected successfully');
      setIsConnected(true);
      retryCount.current = 0;
      retryDelay.current = 1000;

      // Setup ping interval (match server's 30s)
      pingInterval.current = setInterval(() => {
        if (socket.current?.readyState === WebSocket.OPEN) {
          socket.current.send(JSON.stringify({ type: 'ping' }));
        }
      }, 25000); // 25s to be slightly faster than server's 30s
    };

    socket.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        // Handle ping response if needed
        if (message.type === 'ping') {
          socket.current?.send(JSON.stringify({ type: 'pong' }));
          return;
        }

        // Handle actual notifications
        console.log('Received notification:', message);
        // Here you would process your notifications
        // e.g., update state, show toast, etc.

      } catch (error) {
        console.log('Received non-JSON message:', event.data);
      }
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    socket.current.onclose = (event) => {
      console.log(`WebSocket closed (code ${event.code}): ${event.reason}`);
      setIsConnected(false);
      
      // Cleanup ping interval
      if (pingInterval.current) {
        clearInterval(pingInterval.current);
        pingInterval.current = null;
      }

      // Attempt reconnect if not normal closure
      if (event.code !== 1000 && retryCount.current < maxRetries) {
        const delay = retryDelay.current;
        retryCount.current++;
        retryDelay.current = Math.min(delay * 2, 30000); // Exponential backoff, max 30s
        
        console.log(`Will attempt reconnect in ${delay}ms (attempt ${retryCount.current}/${maxRetries})`);
        setTimeout(connect, delay);
      }
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      // Cleanup on unmount
      if (socket.current) {
        socket.current.close();
      }
      if (pingInterval.current) {
        clearInterval(pingInterval.current);
      }
    };
  }, [connect]);

  return {
    isConnected,
    send: (message: WebSocketMessage) => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify(message));
      }
    }
  };
};

// Usage example in a React component
const NotificationComponent = () => {
  const { isConnected } = useNotificationWebSocket();

  return (
    <div>
      Connection status: {isConnected ? 'Connected' : 'Disconnected'}
      {/* Your component UI */}
    </div>
  );
};

export default NotificationComponent;