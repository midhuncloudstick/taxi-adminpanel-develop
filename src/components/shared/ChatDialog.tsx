import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { bookingInChat } from "@/redux/Slice/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";

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
}

export function ChatDialog({ bookingId, customerId, driverId }: ChatDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState<"customer" | "driver" | "both">("both");
  const [messageContent, setMessageContent] = useState('');
  
  const messages = useSelector((state: any) => state.booking.messages);
  const dispatch = useDispatch<AppDispatch>();

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return; 

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "admin", 
      recipient: recipient,
      content: messageContent,
      timestamp: new Date(),
    };

    try {
      await dispatch(bookingInChat({ message: messageContent ,bookingId})).unwrap(); 

      setMessageContent(''); 
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
   
  }, [bookingId, dispatch]);

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
        <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Booking Chat - {bookingId}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages?.map((message: Message) => (
                <div 
                  key={message.id}
                  className={`p-3 rounded-lg max-w-[80%] ${message.sender === "admin" ? 'bg-green-500' : 'bg-blue-500'}`}
                >
                  <div className="text-xs mb-1">
                    {message.sender === "admin" && <span className="text-xs opacity-80">{" → "}</span>}
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
