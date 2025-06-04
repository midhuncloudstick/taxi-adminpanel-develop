import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const BookingWebsocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState([])
  useEffect(() => {
    ws.current = new WebSocket("wss://brisbane.cloudhousetechnologies.com/booking");
   
    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");

      //ws.current?.send(JSON.stringify({ token: "123" }));
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessage((prev) => [...prev, event.data])


        if (data.message) {

          alert(`📢 ${data.message}`);
        }

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
    console.log("setMessages", message)
    return () => {
      ws.current?.close();
    };
  }, []);

  return null;
};

export default BookingWebsocket;
