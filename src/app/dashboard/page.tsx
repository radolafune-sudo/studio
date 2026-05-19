
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  ArrowRightLeft, 
  ArrowUpRight,
  TrendingUp,
  Activity
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Dashboard() {
  const [marketValue, setMarketValue] = useState(7240.50);

  // Slow Forex-style counter
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketValue(prev => {
        const change = (Math.random() - 0.5) * 2.5; // Small stochastic moves
        const next = prev + change;
        if (next > 9000) return 8900;
        if (next < 5000) return 5100;
        return next;
      });
    }, 2000); // Slower updates
    return () => clearInterval(interval);
  }, []);

  const bannerPerson = PlaceHolderImages.find(img => img.id === "trader-1");
  const bannerChart = PlaceHolderImages.find(img => img.id === "chart-preview");
  const btcChart = PlaceHolderImages.find(img => img.id === "btc-chart");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
        {/* Top Banners - Original Blue/Cyan Theme */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Box 1: Proven Strategy */}
          <Card className="bg-primary/5 border-primary/10 overflow-hidden h-[200px] rounded-[1.5rem] flex items-center relative group shadow-sm">
            <CardContent className="p-8 flex justify-between items-center w-full z-10">
              <div className="max-w-[65%] space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-foreground">
                  Ready to start today with a proven strategy?
                </h2>
                <p className="text-sm font-semibold text-primary tracking-wide">CopyTrade Now!</p>
              </div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 transition-transform group-hover:scale-105 duration-700 opacity-80">
                <Image 
                  src={btcChart?.imageUrl || "https://picsum.photos/seed/btc/400/400"} 
                  alt="BTC Illustration" 
                  fill 
                  className="object-contain"
                  data-ai-hint="bitcoin chart"
                />
              </div>
            </CardContent>
            {/* Background blending detail */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          </Card>

          {/* Box 2: Precision Meets Performance */}
          <Card className="bg-accent/5 border-accent/10 overflow-hidden h-[200px] rounded-[1.5rem] flex items-center relative group shadow-sm">
            <CardContent className="p-8 flex justify-between items-center w-full z-10">
              <div className="max-w-[65%] space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-foreground">
                  Where precision meets performance
                </h2>
                <div className="flex items-center gap-2 text-accent font-bold">
                  <Activity className="h-4 w-4" />
                  <span className="text-lg font-mono tracking-tighter">
                    ${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 transition-transform group-hover:scale-105 duration-700">
                <Image 
                  src={bannerChart?.imageUrl || "https://picsum.photos/seed/chart/400/400"} 
                  alt="Market Data" 
                  fill 
                  className="object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all"
                  data-ai-hint="forex chart"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Section - Dark Card with Blue/Cyan Accents */}
        <Card className="bg-slate-950 text-white border-none shadow-2xl overflow-hidden rounded-[1.5rem] relative">
          {/* Subtle Blue Gradient Accent */}
          <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
          
          <CardContent className="p-8 md:p-12 space-y-10 relative z-10">
            <div className="flex justify-between items-start">
              {/* Profile Avatar */}
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-accent text-sm border border-accent/20">
                MT
              </div>
              
              {/* Balance Center */}
              <div className="text-center">
                <div className="flex items-start justify-center">
                  <span className="text-xl font-medium text-white/50 mt-1 mr-1">$</span>
                  <span className="text-6xl font-black tracking-tighter">0.00</span>
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Total Funds</p>
              </div>

              {/* Notification */}
              <div className="relative">
                <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all cursor-pointer border border-white/5">
                  <Bell className="h-6 w-6 text-slate-300" />
                  <div className="absolute top-0 right-0 h-4 w-4 bg-accent rounded-full border-2 border-[#0a0a0a] flex items-center justify-center text-[8px] font-bold text-black">
                    1
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Button 
                variant="secondary" 
                className="w-full h-14 rounded-full bg-white/5 hover:bg-white/10 text-white border-white/10 flex items-center justify-center gap-2 font-bold text-base"
              >
                <ArrowRightLeft className="h-5 w-5" />
                Transfer
              </Button>
              <Button 
                className="w-full h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center gap-2 font-bold text-base shadow-lg shadow-accent/20"
              >
                <ArrowUpRight className="h-5 w-5" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
