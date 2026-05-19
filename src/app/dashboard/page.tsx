
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  ArrowRightLeft, 
  ArrowUpRight,
  Activity
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Dashboard() {
  const [marketValue, setMarketValue] = useState(7240.50);

  useEffect(() => {
    // Simulating slow, stochastic Forex market movement
    const interval = setInterval(() => {
      setMarketValue(prev => {
        const change = (Math.random() - 0.5) * 0.85;
        const next = prev + change;
        if (next > 9000) return 8900;
        if (next < 5000) return 5100;
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Banner 1: Ready to Start */}
          <Card className="bg-primary border-none overflow-hidden h-[200px] rounded-[1.5rem] flex items-center relative group shadow-lg">
            <CardContent className="p-8 flex justify-between items-center w-full z-10 text-white">
              <div className="max-w-[65%] space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight">
                  Ready to start today with a proven strategy?
                </h2>
                <p className="text-sm font-semibold text-accent tracking-wide uppercase">CopyTrade Now!</p>
              </div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 transition-transform group-hover:scale-105 duration-700 opacity-90">
                <Image 
                  src="https://picsum.photos/seed/btc99/400/400" 
                  alt="BTC Illustration" 
                  fill 
                  className="object-contain"
                  data-ai-hint="bitcoin crypto"
                />
              </div>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          </Card>

          {/* Banner 2: Precision meets performance */}
          <Card className="bg-accent/15 border border-accent/20 overflow-hidden h-[200px] rounded-[1.5rem] flex items-center relative group shadow-sm">
            <CardContent className="p-8 flex justify-between items-center w-full z-10">
              <div className="max-w-[65%] space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-foreground">
                  Where precision meets performance
                </h2>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Activity className="h-4 w-4" />
                  <span className="text-lg font-mono tracking-tighter">
                    ${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 transition-transform group-hover:scale-105 duration-700">
                <Image 
                  src="https://picsum.photos/seed/forexchart99/600/400" 
                  alt="Market Data" 
                  fill 
                  className="object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all shadow-md"
                  data-ai-hint="forex chart"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Summary Card */}
        <Card className="bg-[#0a0a14] text-white border-none shadow-2xl overflow-hidden rounded-[2rem] relative">
          <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
          
          <CardContent className="p-10 md:p-16 space-y-12 relative z-10">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center font-bold text-accent text-sm border border-accent/30">
                MT
              </div>
              
              <div className="text-center">
                <div className="flex items-start justify-center">
                  <span className="text-2xl font-medium text-white/40 mt-1 mr-1">$</span>
                  <span className="text-7xl font-black tracking-tighter">0.00</span>
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.25em] mt-4">Total Funds</p>
              </div>

              <div className="relative">
                <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all cursor-pointer border border-white/10 group">
                  <Bell className="h-6 w-6 text-slate-400 group-hover:text-white transition-colors" />
                  <div className="absolute top-0 right-0 h-4 w-4 bg-accent rounded-full border-2 border-[#0a0a14] flex items-center justify-center text-[8px] font-bold text-black">
                    1
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link href="/transfer" className="w-full">
                <Button 
                  variant="secondary" 
                  className="w-full h-16 rounded-full bg-white/5 hover:bg-white/10 text-white border-white/10 flex items-center justify-center gap-3 font-bold text-lg transition-all"
                >
                  <ArrowRightLeft className="h-6 w-6" />
                  Transfer
                </Button>
              </Link>
              <Button 
                className="w-full h-16 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center gap-3 font-bold text-lg shadow-xl shadow-accent/10 transition-all"
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
