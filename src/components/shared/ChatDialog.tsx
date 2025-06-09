import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Send, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { bookingInChat } from "@/redux/Slice/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toast } from "sonner";

interface ChatDialogProps {
  bookingId: string;
  customerId?: string;
  driverId?: string;
  customer :string
}

interface Message {
  id: string;
  sender: "customer" | "driver" | "admin";
  recipient: "customer" | "driver" | "both";
  content: string;
  timestamp: Date;
  bookingId: string; // Ensure this is included in your Message type
}

export function ChatDialog({ bookingId, customer,customerId, driverId }: ChatDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState<"customer" | "driver" | "both">("both");
  const [messageContent, setMessageContent] = useState('');
  const allMessages = useSelector((state: any) => state.booking.messages);
  const [messages, setMessages] = useState<Message[]>([]);
  const dispatch = useDispatch<AppDispatch>();
const messagesEndRef = useRef<HTMLDivElement>(null);
const scrollRef = useRef<HTMLDivElement>(null);

  // Filter messages for this booking
  useEffect(() => {
    const filtered = allMessages?.filter((msg: Message) => msg.bookingId === bookingId) || [];
    setMessages(filtered);
  }, [allMessages, bookingId]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "admin",
      recipient: recipient,
      content: messageContent,
      timestamp: new Date(),
      bookingId: bookingId,  // Make sure your Message type includes bookingId
    };

    // Optimistically add the message to the chat
    setMessages(prev => [...prev, newMessage]);

    try {
      await dispatch(bookingInChat({ message: messageContent, bookingId })).unwrap();
      setMessageContent('');
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Scroll to bottom when messages change
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

// Auto-scroll to bottom when dialog opens
useEffect(() => {
  if (isOpen) {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
}, [isOpen]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 text-taxi-blue hover:text-taxi-blue hover:bg-taxi-blue/10"
      >
        <MessageCircle size={16} />
      </Button>

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="flex flex-col border rounded p-0 shadow-sm h-[30rem] max-h-[90vh] bg-white">
    {/* Fixed Header */}
    <DialogHeader className="sticky top-0 bg-white z-10 border-b p-4 space-y-2">
      <div className="flex justify-between items-start">
        <DialogTitle className="text-lg font-semibold">Booking Chat</DialogTitle>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm bg-gray-100 px-2 py-1 rounded">
            <span className="font-medium text-gray-700">Booking:</span>
            <span className="text-blue-600">{bookingId}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Customer:</span>
          <span className="text-sm ml-1 text-gray-900">{customer}</span>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 pt-1">Type your message below to chat with the customer.</p>
    </DialogHeader>

    {/* Scrollable Messages */}
    <ScrollArea className="flex-1 px-4 py-2 overflow-y-auto" ref={scrollRef}>
      <div className="space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg max-w-[80%] ${
              message.sender === "admin"
                ? "bg-blue-500 ml-auto text-white"
                : "bg-gray-200 mr-auto text-gray-800"
            }`}
          >
            <div className="text-xs mb-1 opacity-80">
              {message.sender.charAt(0).toUpperCase() + message.sender.slice(1)}
            </div>
            <p>{message.content}</p>
            <div className={`text-xs mt-1 opacity-75 ${
              message.sender === "admin" ? "text-blue-100" : "text-gray-500"
            }`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        {/* Empty div to ensure scroll stays at bottom */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>

    {/* Fixed Input Area */}
    <div className="sticky bottom-0 bg-white border-t p-4">
      <div className="flex gap-2">
        <Textarea
          placeholder="Type your message here..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          className="resize-none flex-1 min-h-[40px] max-h-[120px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-600 h-[40px] w-[40px]"
          disabled={!messageContent.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
    </>
  );
}
