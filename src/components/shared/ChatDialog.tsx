import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Send } from "lucide-react";
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
}

interface Message {
  id: string;
  sender: "customer" | "driver" | "admin";
  recipient: "customer" | "driver" | "both";
  content: string;
  timestamp: Date;
  bookingId: string; // Ensure this is included in your Message type
}

export function ChatDialog({ bookingId, customerId, driverId }: ChatDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState<"customer" | "driver" | "both">("both");
  const [messageContent, setMessageContent] = useState('');
  const allMessages = useSelector((state: any) => state.booking.messages);
  const [messages, setMessages] = useState<Message[]>([]);
  const dispatch = useDispatch<AppDispatch>();
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
        <DialogContent className="mt-2 border rounded p-4 shadow-sm max-h-60 overflow-y-auto space-y-2 bg-white">
          <DialogHeader>
            <DialogTitle>Booking Chat - {bookingId}</DialogTitle>
            <p>Type your message below to chat.</p>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.sender === "admin"
                      ? "bg-blue-500 ml-auto text-white"
                      : "bg-blue-500 mr-auto text-white"
                  }`}
                  style={{
                    alignSelf: message.sender === "admin" ? "flex-end" : "flex-start",
                  }}
                >
                  <div className="text-xs mb-1 opacity-80">
                    {message.sender.charAt(0).toUpperCase() + message.sender.slice(1)}
                  </div>
                  <p>{message.content}</p>
                  <div className="text-xs mt-1 opacity-75 text-right">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-4 flex gap-2">
            <Textarea
              placeholder="Type your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="resize-none flex-1"
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
              className="bg-taxi-blue hover:bg-taxi-blue/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
