import { useEffect, useRef, useState } from 'react';
// import { toast } from 'react-toastify';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export const useBookingWebSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const retryCount = useRef(0);
  const maxRetries = 5;
  const retryDelay = useRef(1000);
  const socketUrl = 'wss://brisbane.cloudhousetechnologies.com/booking/notification';

  const connect = () => {
    setConnectionStatus('connecting');

    if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
      ws.current.close();
    }

    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      setConnectionStatus('connected');
      retryCount.current = 0;
      retryDelay.current = 1000;
     // toast.success('Connected to real-time updates');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);
        // Handle message here, or trigger external callbacks
      } catch {
        console.log('Raw message:', event.data);
      }
    };

    ws.current.onerror = () => {
      setConnectionStatus('disconnected');
    };

    ws.current.onclose = (event) => {
      setConnectionStatus('disconnected');
      if (retryCount.current < maxRetries && !event.wasClean) {
        const delay = retryDelay.current;
        retryCount.current++;
        retryDelay.current = Math.min(delay * 2, 30000);

        setTimeout(connect, delay);
      } else if (retryCount.current >= maxRetries) {
        console.log("datass")
        //toast.error('Unable to connect after several attempts.');
      }
    };
  };

  useEffect(() => {
    connect();

    const handleBeforeUnload = () => {
      if (ws.current) {
        ws.current.close(1000, 'Tab closed');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (ws.current) {
        ws.current.close(1000, 'Component unmounted');
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return { connectionStatus };
};

