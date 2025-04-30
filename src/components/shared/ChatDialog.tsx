
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Booking, getBookingById, getDriverById, getCustomerById } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "../ui/badge";
import { Send } from "lucide-react";

interface Message {
  id: string;
  bookingId: string;
  sender: "admin" | "customer" | "driver";
  recipient: "customer" | "driver" | "both";
  content: string;
  timestamp: Date;
}

interface ChatDialogProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatDialog({ bookingId, isOpen, onClose }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [recipient, setRecipient] = useState<"customer" | "driver" | "both">("both");
  
  const booking = getBookingById(bookingId);
  const customer = booking ? getCustomerById(booking.customerId) : null;
  const driver = booking ? getDriverById(booking.driver) : null;

  // Initialize with mock messages
  useEffect(() => {
    if (isOpen && booking) {
      // Simulate loading messages for this booking
      setMessages([
        {
          id: "msg-1",
          bookingId: booking.id,
          sender: "admin",
          recipient: "both",
          content: "Your booking has been received.",
          timestamp: new Date(Date.now() - 86400000), // yesterday
        },
        {
          id: "msg-2",
          bookingId: booking.id,
          sender: "customer",
          recipient: "admin",
          content: "Thank you for the confirmation.",
          timestamp: new Date(Date.now() - 82800000), // a bit later
        },
        {
          id: "msg-3",
          bookingId: booking.id,
          sender: "driver",
          recipient: "admin",
          content: "I'll be there on time.",
          timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        }
      ]);
    }
  }, [isOpen, bookingId, booking]);

  const sendMessage = () => {
    if (!messageInput.trim() || !booking) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      bookingId: booking.id,
      sender: "admin",
      recipient,
      content: messageInput,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderLabel = (sender: Message["sender"]) => {
    switch (sender) {
      case "admin": return "Admin";
      case "customer": return customer?.name || "Customer";
      case "driver": return driver?.name || "Driver";
      default: return sender;
    }
  };

  const getRecipientLabel = (recipient: Message["recipient"]) => {
    switch (recipient) {
      case "customer": return "To Customer";
      case "driver": return "To Driver";
      case "both": return "To Both";
      default: return recipient;
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chat - Booking {bookingId}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-2 h-[400px] overflow-y-auto mb-4 p-2 border rounded-md">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex flex-col ${
                message.sender === "admin" 
                  ? "items-end" 
                  : "items-start"
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="text-xs text-gray-500">
                  {getSenderLabel(message.sender)} • {formatTime(message.timestamp)}
                </span>
                {message.sender === "admin" && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {getRecipientLabel(message.recipient)}
                  </Badge>
                )}
              </div>
              <div
                className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  message.sender === "admin"
                    ? "bg-taxi-blue text-white"
                    : message.sender === "customer"
                    ? "bg-yellow-100"
                    : "bg-green-100"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400">
              No messages yet
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Select value={recipient} onValueChange={(val) => setRecipient(val as "customer" | "driver" | "both")}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select recipient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Both Customer & Driver</SelectItem>
              <SelectItem value="customer">Customer Only</SelectItem>
              <SelectItem value="driver">Driver Only</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex w-full">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <Button
              type="button"
              size="icon"
              onClick={sendMessage}
              className="ml-2 bg-taxi-teal hover:bg-taxi-teal/90"
              disabled={!messageInput.trim()}
            >
              <Send size={18} />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
