import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { updatelist } from "./redux/Slice/bookingSlice";

const BookingWebsocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
     ws.current = new WebSocket("wss://brisbane.cloudhousetechnologies.com/ws/bookings");
   
    ws.current.onopen = () => {
      console.log("✅Booking WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
  
      dispatch(updatelist(data))
      } catch (err) {
       
        console.warn("⚠️ Received non-JSON WebSocket message:", event.data);
      }
    };

    ws.current.onerror = (err) => {
      console.error("❌Booking WebSocket error:", err);
    };

    ws.current.onclose = () => {
      console.log("🔌Booking WebSocket disconnected");
    };
    console.log("setMessages", message)
    return () => {
      ws.current?.close();
    };
  }, []);

  return null;
};

export default BookingWebsocket;
