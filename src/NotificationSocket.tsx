import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addNotification } from './redux/Slice/notificationSlice';

const NotificationSocket = () => {
  const ws = useRef<WebSocket | null>(null);
 
  const [message, setMessage] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // Create audio element
  
    
    ws.current = new WebSocket("wss://brisbane.cloudhousetechnologies.com/booking/notification");
   
    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      try {
        dispatch(addNotification(event.data));
        
        // Play notification sound
      
        
      } catch (err) {
        alert(`📢 ${event.data}`);
        console.warn("⚠️ Received non-JSON WebSocket message:", event.data);
      }
    };

    ws.current.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    ws.current.onclose = () => {
      console.log("🔌 WebSocket disconnected");
    };

    return () => {
      ws.current?.close();
      // Clean up audio element
   
    };
  }, []);

  return null;
};

export default NotificationSocket;