
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Play, Square, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CopiedTrades() {
  const [isTrading, setIsTrading] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);
  const [todayPnL, setTodayPnL] = useState(0);
  const [balance, setBalance] = useState(450.00); 
  const [history, setHistory] = useState<any[]>([]);
  const [tradeCount, setTradeCount] = useState(0);

  // Fast MT5-style movement simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTrading) {
      interval = setInterval(() => {
        setTotalProfit((prev) => {
          let nextVal = prev;
          
          // Logic for first 4 trades (Win Cycle: Minimal Profits)
          if (tradeCount < 4) {
            const winBias = 0.05; // Minimal bias
            const fluctuation = (Math.random() - 0.5 + winBias) * 0.3;
            nextVal = prev + fluctuation;
            
            // Ceiling at $99.99
            if (nextVal >= 99.99) nextVal = 99.99;
          } 
          // Logic for 5th trade (Loss Cycle)
          else if (tradeCount === 4) {
            const lossBias = -0.5; // Heavy loss bias
            const fluctuation = (Math.random() - 0.5 + lossBias) * 2.5;
            nextVal = prev + fluctuation;
          }
          // After 5th trade
          else {
            const lossBias = -0.3;
            const fluctuation = (Math.random() - 0.5 + lossBias) * 1.5;
            nextVal = prev + fluctuation;
          }

          // Liquidation logic
          if (nextVal + balance <= 0) {
            setIsTrading(false);
            return -balance;
          }

          return nextVal;
        });

        // Today's PnL movements - making it minimal
        setTodayPnL((prev) => {
          const change = (Math.random() - 0.5) * 0.1;
          return prev + change;
        });

        // Periodic transaction history update
        if (Math.random() > 0.985) {
          const isWin = tradeCount < 4;
          const newTrade = {
            id: Date.now(),
            pair: "XAUUSD",
            type: Math.random() > 0.5 ? "Buy" : "Sell",
            lot: (Math.random() * 0.5 + 0.1).toFixed(2),
            profit: isWin ? `+${(Math.random() * 2 + 0.5).toFixed(2)}` : `${(Math.random() * -15 - 5).toFixed(2)}`,
            time: "Just Now",
            isBuy: Math.random() > 0.5
          };
          setHistory(prev => [newTrade, ...prev].slice(0, 15));
        }
      }, 100); // Fast interval for MT5 feel
    }
    return () => clearInterval(interval);
  }, [isTrading, balance, totalProfit, tradeCount]);

  const handleStart = () => {
    setIsTrading(true);
  };

  const handleStop = () => {
    setIsTrading(false);
    
    // Specific 100% loss logic for the 5th trade stop
    if (tradeCount === 4) {
      setTotalProfit(-balance);
    }
    
    // Increment trade count
    setTradeCount(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0E0A] text-white font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
        {/* Status Message */}
        <div className={cn(
          "w-full p-4 rounded-2xl flex items-center gap-3 border transition-all duration-500",
          isTrading 
            ? "bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E] animate-pulse" 
            : "bg-white/5 border-white/10 text-white/70"
        )}>
          <Info className="h-5 w-5 shrink-0" />
          <p className="text-sm font-black uppercase tracking-tight">
            {isTrading 
              ? "You are now copying Elite hub fx trades" 
              : "You are about to copy elite hub fx trades"}
          </p>
        </div>

        {/* Header Stats */}
        <div className="space-y-4 bg-white/5 p-6 rounded-[2rem] border border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Total Profit</span>
            <span className={cn(
              "text-2xl font-black font-mono tracking-tighter",
              totalProfit >= 0 ? "text-[#22C55E]" : "text-red-500"
            )}>
              {totalProfit.toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Today's PnL</span>
            <span className={cn(
              "text-xl font-bold font-mono tracking-tight",
              todayPnL >= 0 ? "text-[#22C55E]" : "text-red-500"
            )}>
              {todayPnL.toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-white/5 pt-4">
            <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Available Capital</span>
            <span className="text-2xl font-black font-mono tracking-tighter">
              {Math.max(0, balance + totalProfit).toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* My Master(s) Section */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight uppercase">My Master(s)</h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Client: John Doe</p>
          </div>
          
          <Card className="bg-[#141A14] border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#D4EBE0] rounded-full flex items-center justify-center text-[#1A2E24] font-black text-xl">
                  AF
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">Amiin FX</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-[#E9D9A7] text-[#5C4D1D] hover:bg-[#E9D9A7] border-none font-bold text-[10px] uppercase px-3 py-1">
                      APPROVED
                    </Badge>
                    <Badge className={cn(
                      "border-none font-bold text-[10px] uppercase px-3 py-1 transition-all",
                      isTrading ? "bg-[#22C55E] text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]" : "bg-muted text-muted-foreground"
                    )}>
                      {isTrading ? "TRADING LIVE" : "INACTIVE"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleStart}
                  disabled={isTrading || (balance + totalProfit <= 0)}
                  className="flex-1 h-16 bg-[#22C55E] hover:bg-[#1da850] text-white font-black uppercase text-lg rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-[#22C55E]/20"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Start Trading
                </Button>
                <Button 
                  onClick={handleStop}
                  disabled={!isTrading}
                  className="flex-1 h-16 bg-[#EF4444] hover:bg-[#dc2626] text-white font-black uppercase text-lg rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-[#EF4444]/20"
                >
                  <Square className="h-5 w-5 fill-current" />
                  Stop Trading
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* My Copied Trades Section */}
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

          {history.length === 0 && !isTrading ? (
            <div className="p-16 text-center border-2 border-dashed border-white/10 rounded-[2.5rem] space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg">No Active Trades</p>
                <p className="text-sm text-muted-foreground font-medium">Start copy trading to view real-time market entries.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-12">
              {/* Active Running Order */}
              {isTrading && (
                <div className="flex items-center justify-between p-6 bg-primary/5 rounded-[2rem] border border-primary/20 animate-in fade-in duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary fill-current" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-black text-xl tracking-tight">XAUUSD</div>
                      <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Entry</div>
                    </div>
                  </div>
                  <div className={cn(
                    "text-2xl font-black font-mono tracking-tighter",
                    totalProfit >= 0 ? "text-[#22C55E]" : "text-red-500"
                  )}>
                    {totalProfit > 0 ? "+" : ""}{totalProfit.toFixed(2)}
                  </div>
                </div>
              )}

              {/* Transaction History */}
              {history.map(trade => (
                <div key={trade.id} className="flex items-center justify-between p-6 bg-[#141A14] rounded-[2rem] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E9D9A7]/10 rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6 text-[#E9D9A7] fill-current" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-black text-xl tracking-tight">{trade.pair}</div>
                      <div className={cn("text-[10px] font-bold uppercase tracking-widest", trade.profit.startsWith('+') ? "text-blue-400" : "text-red-400")}>
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
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
