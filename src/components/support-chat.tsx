
"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useUser, useCollection, sendSupportMessage } from "@/firebase";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

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
    await sendSupportMessage(user.uid, message);
    setMessage("");
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-body">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-primary shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] flex items-center justify-center transition-all animate-pulse group active:scale-95"
        >
          <MessageCircle className="h-8 w-8 text-white fill-current" />
          <div className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white">1</div>
        </button>
      ) : (
        <Card className="w-[320px] sm:w-[380px] h-[500px] rounded-[2rem] border-none shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <CardHeader className="bg-primary p-6 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-sm font-black uppercase tracking-widest">Live Support</CardTitle>
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
          
          <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-40">
                <MessageCircle className="h-10 w-10 text-primary" />
                <p className="text-xs font-black uppercase tracking-tighter">Start a conversation with our experts</p>
              </div>
            ) : (
              filteredMessages.map((msg, i) => (
                <div key={i} className={cn("flex flex-col", msg.isAdmin ? "items-start" : "items-end")}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm",
                    msg.isAdmin ? "bg-white text-foreground rounded-tl-none" : "bg-primary text-white rounded-tr-none"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] font-bold text-muted-foreground mt-1 uppercase">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </CardContent>

          <CardFooter className="p-4 border-t bg-white flex gap-2">
            <Input
              placeholder="Type your message..."
              className="h-12 bg-muted/30 border-none rounded-xl font-medium focus-visible:ring-primary"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} size="icon" className="h-12 w-12 rounded-xl bg-primary text-white hover:scale-105 active:scale-95 transition-transform">
              <Send className="h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
