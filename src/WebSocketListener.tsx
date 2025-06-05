import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addAlert } from "./redux/Slice/notificationSlice";

const WebSocketListener = () => {
  const ws = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState([])
  const dispatch=useDispatch()
  useEffect(() => {
    ws.current = new WebSocket("wss://brisbane.cloudhousetechnologies.com/ws/events");
   
    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");

      //ws.current?.send(JSON.stringify({ token: "123" }));
    };

    ws.current.onmessage = (event) => {
      try {
        console.log('====================================');
        console.log(event.data);
        console.log('====================================');
        const data = JSON.parse(event.data);

        dispatch(addAlert(data.bookings))

     
      } catch (err) {
      
        console.warn("⚠️ Received non-JSON WebSocket message:", event.data);
      }
    };

    ws.current.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    ws.current.onclose = () => {
      console.log("🔌 WebSocket disconnected");
    };
    console.log("setMessages", message)
    return () => {
      ws.current?.close();
    };
  }, []);

  return null;
};

export default WebSocketListener;
