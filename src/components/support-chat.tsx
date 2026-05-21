
"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useUser, useCollection, sendSupportMessage } from "@/firebase";
import { cn } from "@/lib/utils";

export function SupportChat() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: messages } = useCollection<any>(user ? 'support_messages' : null);
  
  const filteredMessages = messages
    .filter(m => m.userId === user?.uid)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredMessages, isOpen]);

  const handleSend = async () => {
    if (!message || !user) return;
    sendSupportMessage(user.uid, message);
    setMessage("");
  };

  if (!user) return null;

  const hasUnread = filteredMessages.length > 0 && filteredMessages[filteredMessages.length - 1].isAdmin;

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-body">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-primary shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center transition-all animate-pulse group"
        >
          <MessageCircle className="h-8 w-8 text-white fill-current" />
          {hasUnread && (
            <div className="absolute -top-1 -right-1 bg-red-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white">1</div>
          )}
        </button>
      ) : (
        <Card className="w-[320px] sm:w-[380px] h-[550px] rounded-[2.5rem] border-none shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          <CardHeader className="bg-primary p-6 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-sm font-black uppercase tracking-widest">Support Live</CardTitle>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
                  <span className="text-[10px] font-bold text-white/70 uppercase">Online</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          
          <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/10">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <MessageCircle className="h-10 w-10 text-primary mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest">Start a conversation with our support</p>
              </div>
            ) : (
              filteredMessages.map((msg, i) => (
                <div key={i} className={cn("flex flex-col", msg.isAdmin ? "items-start" : "items-end")}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-[13px] font-medium shadow-sm",
                    msg.isAdmin ? "bg-white text-foreground rounded-tl-none" : "bg-primary text-white rounded-tr-none"
                  )}>
                    {msg.text}
                  </div>
                  <p className="text-[8px] mt-1 text-muted-foreground font-bold uppercase tracking-tighter">
                    {msg.isAdmin ? 'Expert Agent' : 'You'} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              ))
            )}
          </CardContent>

          <CardFooter className="p-4 border-t bg-white flex gap-2">
            <Input
              placeholder="Type here..."
              className="h-12 bg-muted/30 border-none rounded-xl font-medium"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} size="icon" className="h-12 w-12 rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Send className="h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
