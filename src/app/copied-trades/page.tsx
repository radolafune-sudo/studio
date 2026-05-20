
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CopiedTrades() {
  const [isTrading, setIsTrading] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);
  const [todayPnL, setTodayPnL] = useState(0);

  // Live profit counter (erratic movement like MT5, never reaches $100)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTrading) {
      interval = setInterval(() => {
        // Random fluctuation between 1 and 99.99
        const newProfit = (Math.random() * 98) + 1;
        setTotalProfit(newProfit);
        setTodayPnL(newProfit * 0.4); // Simulated daily PnL
        if (!hasHistory) setHasHistory(true);
      }, 800);
    } else {
      setTotalProfit(0);
      setTodayPnL(0);
    }
    return () => clearInterval(interval);
  }, [isTrading, hasHistory]);

  const tradeHistory = [
    { id: 1, pair: "XAUUSD", type: "Buy", lot: "0.70", profit: "+5,541.47", time: "Today", isBuy: true },
    { id: 2, pair: "XAUUSD", type: "Buy", lot: "0.30", profit: "+3,069.17", time: "Yesterday", isBuy: true },
    { id: 3, pair: "XAUUSD", type: "Sell", lot: "0.15", profit: "+556.84", time: "Yesterday", isBuy: false },
    { id: 4, pair: "XAUUSD", type: "Sell", lot: "0.10", profit: "+1,253.56", time: "Yesterday", isBuy: false },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0E0A] text-white font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-10">
        {/* Header Stats */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-bold text-sm uppercase tracking-wider">Total Profit</span>
            <span className="text-xl font-bold font-mono tracking-tight text-[#22C55E]">
              {totalProfit > 0 ? totalProfit.toFixed(2) : "0.00"} USD
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-bold text-sm uppercase tracking-wider">Today's PnL</span>
            <span className="text-xl font-bold font-mono tracking-tight text-[#22C55E]">
              {todayPnL > 0 ? todayPnL.toFixed(2) : "0.00"} USD
            </span>
          </div>
        </div>

        {/* My Master(s) Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight uppercase">My Master(s)</h2>
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
                  onClick={() => setIsTrading(true)}
                  disabled={isTrading}
                  className="flex-1 h-14 bg-[#22C55E] hover:bg-[#1da850] text-white font-black uppercase rounded-2xl flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Start Trading
                </Button>
                <Button 
                  onClick={() => setIsTrading(false)}
                  disabled={!isTrading}
                  className="flex-1 h-14 bg-[#EF4444] hover:bg-[#dc2626] text-white font-black uppercase rounded-2xl flex items-center justify-center gap-2"
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
            {hasHistory && (
              <Button variant="outline" size="sm" className="bg-[#1A2E24] border-none text-[#22C55E] font-bold rounded-full px-4 hover:bg-[#1A2E24]/80">
                View All
              </Button>
            )}
          </div>

          {!hasHistory ? (
            <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-3xl space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg">No Trading History</p>
                <p className="text-sm text-muted-foreground font-medium">Start copy trading to see your real-time records here.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Today's Group */}
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-2">
                  <span>Today</span>
                  <span className="text-[#22C55E]">LIVE TRADING</span>
                </div>
                {tradeHistory.filter(t => t.time === "Today").map(trade => (
                  <div key={trade.id} className="flex items-center justify-between p-5 bg-[#141A14] rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="relative flex">
                        <div className="w-10 h-10 bg-[#E9D9A7] rounded-full flex items-center justify-center z-10 border-2 border-[#141A14]">
                          <Zap className="h-5 w-5 text-[#5C4D1D] fill-current" />
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-black text-lg tracking-tight">{trade.pair}</div>
                        <div className={cn("text-xs font-bold", trade.isBuy ? "text-blue-500" : "text-red-500")}>
                          {trade.type} {trade.lot} lot
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#22C55E] font-mono tracking-tighter">
                      +{ (Math.random() * 50).toFixed(2) } USD
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
