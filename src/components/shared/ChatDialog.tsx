
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [messages, setMessages] = useState<Message[]>([
    // {
    //   id: '1',
    //   sender: "customer", 
    //   recipient: "both",
    //   content: "Hi, I'm at the airport. Where should I meet you?",
    //   timestamp: new Date(Date.now() - 1000 * 60 * 60)
    // },
    {
      id: '2',
      sender: "driver",
      recipient: "both",
      content: "I'm on my way, will be there in 10 minutes. Please wait at the pickup zone B.",
      timestamp: new Date(Date.now() - 1000 * 60 * 40)
    },
    {
      id: '3',
      sender: "admin",
      recipient: "customer",
      content: "Your driver is on the way. Please wait at pickup zone B.",
      timestamp: new Date(Date.now() - 1000 * 60 * 38)
    },
    {
      id: '4',
      sender: "admin",
      recipient: "driver",
      content: "Please make sure to help the customer with their luggage.",
      timestamp: new Date(Date.now() - 1000 * 60 * 35)
    }
  ]);

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "admin",
      recipient: recipient,
      content: messageContent,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessageContent('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Booking Chat - {bookingId}</DialogTitle>
          </DialogHeader>
          
          <div className="mb-4">
            <Label htmlFor="recipient">Send message to Customer</Label>
            {/* <Select 
              value={recipient} 
              onValueChange={(value: "customer" | "driver" | "both") => setRecipient(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`p-3 bg-taxi-blue text-white rounded-lg max-w-[80%] ${
                    message.sender === "admin" 

                      
                   
                   
                  }`}
                >
                  <div className="text-xs mb-1">
                    {/* {message.sender ==   "You" 
                      }  */}
                    {message.sender === "admin" && 
                      <span className="text-xs opacity-80">
                        {" → "}
                        {/* { 
                           message.recipient ==   "Customer"} */}
                      </span>
                    }
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
