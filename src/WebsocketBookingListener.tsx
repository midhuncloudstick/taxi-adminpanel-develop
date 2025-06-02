import { useEffect, useRef } from "react";
import { toast } from "sonner";

const WebSocketBookingListener = () => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current= new WebSocket("wss://brisbane.cloudhousetechnologies.com/ws/bookings");
    // Replace this with your actual auth token (from localStorage, Redux, etc.)
  ws.current.onopen = () =>{
     console.log("✅ Booking WebSocket connected");

     ws.current?.send(JSON.stringify({ token :"123"}))
  }
   
    ws.current.onmessage = (event) =>{
   try {
        const data = JSON.parse(event.data);

        if (data.message) {
          alert(`📦 Booking update: ${data.message}`);
        } else {
          toast.info(`📦 Booking: ${JSON.stringify(data)}`);
        }
      } catch (err) {
        console.warn("⚠️ Non-JSON booking message received:", event.data);
        alert(`📦 ${event.data}`);
      }
    }

    ws.current.onerror = (err)=>{
         console.error("❌ WebSocket error:", err);
    };
      ws.current.onclose = () => {
      console.log("🔌 WebSocket disconnected");
    };


   

    return () => {
      ws.current?.close();
    };
  }, []);

  return null;
};

export default WebSocketBookingListener;
