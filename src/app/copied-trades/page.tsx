
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Play, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CopiedTrades() {
  const [isTrading, setIsTrading] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);
  const [todayPnL, setTodayPnL] = useState(0);
  const [balance, setBalance] = useState(450.00); // Initial simulated deposit
  const [history, setHistory] = useState<any[]>([]);

  // Trading logic simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTrading) {
      interval = setInterval(() => {
        setTotalProfit((prev) => {
          // Weighting logic: if balance is high (> 100), bias towards loss
          const bias = balance > 100 ? -0.2 : 0.1;
          const fluctuation = (Math.random() - 0.5 + bias) * 2;
          const nextVal = prev + fluctuation;
          
          // Profit ceiling as requested: "should never reach $100"
          if (nextVal >= 99.99) return 99.99;
          
          // Liquidation logic: if profit (negative) wipes out balance, stop
          if (nextVal + balance <= 0) {
            setIsTrading(false);
            return -balance;
          }

          return nextVal;
        });

        // Today's PnL moves relative to total
        setTodayPnL(totalProfit * 0.4);

        // Periodically add to history when "closing" a mini-trade
        if (Math.random() > 0.95) {
          const newTrade = {
            id: Date.now(),
            pair: "XAUUSD",
            type: Math.random() > 0.5 ? "Buy" : "Sell",
            lot: (Math.random() * 0.5 + 0.1).toFixed(2),
            profit: totalProfit > 0 ? `+${(Math.random() * 5).toFixed(2)}` : `${(Math.random() * -5).toFixed(2)}`,
            time: "Just Now",
            isBuy: Math.random() > 0.5
          };
          setHistory(prev => [newTrade, ...prev].slice(0, 10));
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isTrading, balance, totalProfit]);

  const handleStart = () => setIsTrading(true);
  const handleStop = () => setIsTrading(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0E0A] text-white font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-10">
        {/* Header Stats */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-bold text-sm uppercase tracking-wider">Total Profit</span>
            <span className={cn(
              "text-xl font-bold font-mono tracking-tight",
              totalProfit >= 0 ? "text-[#22C55E]" : "text-red-500"
            )}>
              {totalProfit.toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-bold text-sm uppercase tracking-wider">Today's PnL</span>
            <span className={cn(
              "text-xl font-bold font-mono tracking-tight",
              todayPnL >= 0 ? "text-[#22C55E]" : "text-red-500"
            )}>
              {todayPnL.toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-white/5 pt-4">
            <span className="text-muted-foreground font-bold text-sm uppercase tracking-wider">Capital Available</span>
            <span className="text-xl font-bold font-mono tracking-tight">
              {(balance + totalProfit).toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* My Master(s) Section */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight uppercase">My Master(s)</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Client: John Doe</p>
          </div>
          
          <Card className="bg-[#141A14] border-none rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#D4EBE0] rounded-full flex items-center justify-center text-[#1A2E24] font-black text-xl">
                  AF
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black">Amiin FX</h3>
                  <div className="flex gap-2">
                    <Badge className="bg-[#E9D9A7] text-[#5C4D1D] hover:bg-[#E9D9A7] border-none font-bold text-[10px] uppercase px-3">
                      APPROVED
                    </Badge>
                    <Badge className={cn(
                      "border-none font-bold text-[10px] uppercase px-3",
                      isTrading ? "bg-[#22C55E] text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {isTrading ? "TRADING LIVE" : "INACTIVE"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleStart}
                  disabled={isTrading}
                  className="flex-1 h-14 bg-[#22C55E] hover:bg-[#1da850] text-white font-black uppercase rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Start Trading
                </Button>
                <Button 
                  onClick={handleStop}
                  disabled={!isTrading}
                  className="flex-1 h-14 bg-[#EF4444] hover:bg-[#dc2626] text-white font-black uppercase rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Square className="h-4 w-4 fill-current" />
                  Stop Trading
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* My Copied Trades Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black tracking-tight uppercase">My Copied Trades</h2>
            {isTrading && (
              <Badge variant="outline" className="text-[#22C55E] border-[#22C55E]/20 bg-[#22C55E]/5 animate-pulse">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Live Feed
              </Badge>
            )}
          </div>

          {history.length === 0 && !isTrading ? (
            <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-3xl space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg">No Active Trades</p>
                <p className="text-sm text-muted-foreground font-medium">Start copy trading to see your real-time records here.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-2">
                <span>Recent Activity</span>
                <span className="text-[#22C55E]">Real-Time Sync</span>
              </div>
              
              {/* Active Current PnL Row */}
              {isTrading && (
                <div className="flex items-center justify-between p-5 bg-primary/5 rounded-2xl border border-primary/20 animate-in fade-in duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary fill-current" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-black text-lg tracking-tight">XAUUSD</div>
                      <div className="text-xs font-bold text-primary uppercase">Current Running Order</div>
                    </div>
                  </div>
                  <div className={cn(
                    "text-xl font-black font-mono tracking-tighter",
                    totalProfit >= 0 ? "text-[#22C55E]" : "text-red-500"
                  )}>
                    {totalProfit > 0 ? "+" : ""}{totalProfit.toFixed(2)}
                  </div>
                </div>
              )}

              {/* Transaction History */}
              {history.map(trade => (
                <div key={trade.id} className="flex items-center justify-between p-5 bg-[#141A14] rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E9D9A7] rounded-full flex items-center justify-center border-2 border-[#141A14]">
                      <Zap className="h-5 w-5 text-[#5C4D1D] fill-current" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-black text-lg tracking-tight">{trade.pair}</div>
                      <div className={cn("text-xs font-bold", trade.isBuy ? "text-blue-500" : "text-red-500")}>
                        {trade.type} {trade.lot} lot
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "text-xl font-black font-mono tracking-tighter",
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
