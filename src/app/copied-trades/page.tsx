
"use client";

import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CopiedTrades() {
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
            <span className="text-xl font-bold font-mono tracking-tight">15,574.93 USD</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-bold text-sm uppercase tracking-wider">Today's PnL</span>
            <span className="text-xl font-bold font-mono tracking-tight">5,541.47 USD</span>
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
                    <Badge className="bg-[#22C55E] text-white hover:bg-[#22C55E] border-none font-bold text-[10px] uppercase px-3">
                      LOW risk
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full h-14 bg-transparent border-white/10 text-white font-bold hover:bg-white/5 rounded-2xl">
                Stop Copying
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* My Copied Trades Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black tracking-tight uppercase">My Copied Trades</h2>
            <Button variant="outline" size="sm" className="bg-[#1A2E24] border-none text-[#22C55E] font-bold rounded-full px-4 hover:bg-[#1A2E24]/80">
              View All Trades
            </Button>
          </div>

          <div className="space-y-8">
            {/* Today's Group */}
            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-2">
                <span>Today</span>
                <span className="text-[#22C55E]">+5,541.47 USD</span>
              </div>
              {tradeHistory.filter(t => t.time === "Today").map(trade => (
                <div key={trade.id} className="flex items-center justify-between p-5 bg-[#141A14] rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="relative flex">
                      <div className="w-10 h-10 bg-[#E9D9A7] rounded-full flex items-center justify-center z-10 border-2 border-[#141A14]">
                        <Zap className="h-5 w-5 text-[#5C4D1D] fill-current" />
                      </div>
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center -ml-4 border-2 border-[#141A14]">
                         <span className="text-[8px] font-bold">USA</span>
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
                    {trade.profit} USD
                  </div>
                </div>
              ))}
            </div>

            {/* Yesterday's Group */}
            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-2">
                <span>Yesterday</span>
                <span className="text-[#22C55E]">+4,879.57 USD</span>
              </div>
              {tradeHistory.filter(t => t.time === "Yesterday").map(trade => (
                <div key={trade.id} className="flex items-center justify-between p-5 bg-[#141A14] rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="relative flex">
                      <div className="w-10 h-10 bg-[#E9D9A7] rounded-full flex items-center justify-center z-10 border-2 border-[#141A14]">
                        <Zap className="h-5 w-5 text-[#5C4D1D] fill-current" />
                      </div>
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center -ml-4 border-2 border-[#141A14]">
                         <span className="text-[8px] font-bold">USA</span>
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
                    {trade.profit} USD
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
