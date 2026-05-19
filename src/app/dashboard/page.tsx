
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  ArrowRightLeft, 
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Dashboard() {
  const [counter, setCounter] = useState(5000);
  const btcImage = PlaceHolderImages.find(img => img.id === "btc-chart");

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => {
        if (prev >= 9000) return 5000;
        // Random increment to simulate "real-time" flipping
        return prev + Math.floor(Math.random() * 85) + 10;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">
        {/* Top Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: BTC & Chart Background */}
          <Card className="bg-accent/15 border-none overflow-hidden h-[180px] flex items-center relative group">
            <CardContent className="p-8 flex justify-between items-center w-full z-10">
              <div className="max-w-[65%] space-y-2">
                <h2 className="text-2xl font-bold leading-tight tracking-tight">
                  Ready to start today with a proven strategy?
                </h2>
                <p className="text-sm font-bold opacity-70 tracking-wide uppercase">CopyTrade Now!</p>
              </div>
              <div className="relative w-36 h-36 opacity-90 transition-transform group-hover:scale-110 duration-500">
                <Image 
                  src={btcImage?.imageUrl || "https://picsum.photos/seed/btc1/300/300"} 
                  alt="Bitcoin and Charts" 
                  fill 
                  className="object-contain rounded-xl"
                  data-ai-hint="bitcoin chart"
                />
              </div>
            </CardContent>
          </Card>

          {/* Box 2: Real-time Flipping Counter */}
          <Card className="bg-primary/10 border-none overflow-hidden h-[180px] flex items-center relative group">
            <CardContent className="p-8 flex justify-between items-center w-full z-10">
              <div className="max-w-[60%] space-y-2">
                <h2 className="text-2xl font-bold leading-tight tracking-tight">
                  Live Trading Volume
                </h2>
                <p className="text-sm font-bold opacity-70 tracking-wide uppercase">Processing Real-time</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="h-5 w-5 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">Live</span>
                </div>
                <div className="text-4xl md:text-5xl font-black tracking-tighter tabular-nums text-primary/80">
                  ${counter.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Section */}
        <Card className="bg-slate-950 text-white border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-950 to-primary/20">
          <CardContent className="p-10 md:p-14 space-y-12">
            <div className="flex justify-between items-start">
              {/* Profile Avatar */}
              <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center font-bold text-slate-400 border border-slate-800 text-lg shadow-inner">
                MT
              </div>
              
              {/* Balance */}
              <div className="text-center flex-1">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <span className="text-3xl font-medium text-slate-500 mt-1">$</span>
                  <span className="text-6xl font-bold tracking-tighter">0.00</span>
                </div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-80">Total Funds</p>
              </div>

              {/* Notification */}
              <div className="relative">
                <div className="p-4 bg-slate-900/80 rounded-full hover:bg-slate-800 transition-all cursor-pointer border border-slate-800/50 shadow-lg">
                  <Bell className="h-7 w-7 text-slate-300" />
                  <Badge className="absolute top-1 right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-[10px] font-bold border-2 border-slate-950 rounded-full">
                    1
                  </Badge>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Button 
                variant="outline" 
                className="w-full h-16 rounded-2xl bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:text-white text-white border-2 flex items-center justify-center gap-3 text-xl font-bold transition-all shadow-md"
              >
                <ArrowRightLeft className="h-6 w-6 opacity-70" />
                Transfer
              </Button>
              <Button 
                className="w-full h-16 rounded-2xl bg-white hover:bg-slate-200 text-black flex items-center justify-center gap-3 text-xl font-bold transition-all shadow-lg"
              >
                <ArrowUpRight className="h-6 w-6" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
