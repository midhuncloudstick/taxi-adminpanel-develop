import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Booking {
  id: string;
  // Add other booking properties that match your models.Booking struct
  status: string;
  customerName?: string;
  pickupTime?: string;
  // ... other fields
}

const BookingWebSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const retryCount = useRef(0);
  const maxRetries = 5;

  const connect = () => {
    // Close existing connection if any
    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket('wss://brisbane.cloudhousetechnologies.com/booking/notification');

    ws.current.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      retryCount.current = 0;
      toast.success('Connected to real-time booking updates');
    };

    ws.current.onmessage = (event) => {
      try {
        const booking: Booking = JSON.parse(event.data);
        console.log('📦 Received booking update:', booking);
        
        toast.info(`Booking ${booking.id} updated: ${booking.status}`, {
          description: booking.customerName ? `Customer: ${booking.customerName}` : undefined,
        });
        
        // You can add additional logic here to update your UI state
        // For example, using a state management solution or React context
        
      } catch (error) {
        console.error('Failed to parse booking update:', error);
        toast.warning('Received update but failed to process it');
      }
    };

    ws.current.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setIsConnected(false);
    };

    ws.current.onclose = (event) => {
      console.log('🔌 WebSocket closed:', event.code, event.reason);
      setIsConnected(false);
      
      if (retryCount.current < maxRetries && event.code !== 1000) {
        const delay = Math.min(1000 * Math.pow(2, retryCount.current), 30000);
        retryCount.current++;
        
        console.log(`♻️ Retrying in ${delay}ms (attempt ${retryCount.current}/${maxRetries})`);
        setTimeout(connect, delay);
      }
    };
  };

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Optional: Add UI for connection status
  return (
    <div className="fixed bottom-4 right-4 text-xs">
      {isConnected ? (
        <span className="text-green-500">● Connected</span>
      ) : (
        <span className="text-red-500">● Disconnected (Retrying...)</span>
      )}
    </div>
  );
};

export default BookingWebSocket;