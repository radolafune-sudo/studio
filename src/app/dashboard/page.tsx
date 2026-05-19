
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
  const bannerPerson = PlaceHolderImages.find(img => img.id === "banner-person");
  const bannerPhone = PlaceHolderImages.find(img => img.id === "banner-phone");

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
        {/* Top Banners - Exact Clone from Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Box 1: Proven Strategy */}
          <Card className="bg-[#dcf3e8] border-none overflow-hidden h-[180px] rounded-[1.5rem] flex items-center relative group">
            <CardContent className="p-8 flex justify-between items-center w-full z-10">
              <div className="max-w-[70%] space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
                  Ready to start today with a proven strategy?
                </h2>
                <p className="text-sm font-semibold text-slate-700 tracking-wide">CopyTrade Now!</p>
              </div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 transition-transform group-hover:scale-105 duration-700">
                <Image 
                  src={bannerPerson?.imageUrl || "https://picsum.photos/seed/p1/400/400"} 
                  alt="Trader Illustration" 
                  fill 
                  className="object-contain"
                  data-ai-hint="person money"
                />
              </div>
            </CardContent>
          </Card>

          {/* Box 2: Precision Meets Performance */}
          <Card className="bg-[#dcf3e8] border-none overflow-hidden h-[180px] rounded-[1.5rem] flex items-center relative group">
            <CardContent className="p-8 flex justify-between items-center w-full z-10">
              <div className="max-w-[70%] space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
                  Where precision meets performance
                </h2>
                <p className="text-sm font-semibold text-slate-700 tracking-wide">Trade with 3.5x less slippage</p>
              </div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 transition-transform group-hover:scale-105 duration-700">
                <Image 
                  src={bannerPhone?.imageUrl || "https://picsum.photos/seed/p2/400/400"} 
                  alt="App Illustration" 
                  fill 
                  className="object-contain"
                  data-ai-hint="smartphone app"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Section - Exact Clone from Image */}
        <Card className="bg-[#0a0a0a] text-white border-none shadow-2xl overflow-hidden rounded-[1.5rem] relative">
          {/* Subtle Green Gradient Accent */}
          <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-green-900/20 to-transparent pointer-events-none" />
          
          <CardContent className="p-6 md:p-8 space-y-8">
            <div className="flex justify-between items-start">
              {/* Profile Avatar */}
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-400 text-sm">
                MT
              </div>
              
              {/* Balance Center */}
              <div className="text-center">
                <div className="flex items-start justify-center">
                  <span className="text-lg font-medium text-white/70 mt-1 mr-1">$</span>
                  <span className="text-5xl font-bold tracking-tight">0.00</span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Total Funds</p>
              </div>

              {/* Notification */}
              <div className="relative">
                <div className="p-2.5 bg-slate-800/50 rounded-full hover:bg-slate-700 transition-all cursor-pointer">
                  <Bell className="h-5 w-5 text-slate-300" />
                  <div className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center text-[8px] font-bold">
                    1
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="secondary" 
                className="w-full h-12 rounded-full bg-slate-800/40 hover:bg-slate-700 text-white border-none flex items-center justify-center gap-2 font-bold"
              >
                <ArrowRightLeft className="h-4 w-4" />
                Transfer
              </Button>
              <Button 
                className="w-full h-12 rounded-full bg-white hover:bg-slate-200 text-black flex items-center justify-center gap-2 font-bold"
              >
                <ArrowUpRight className="h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
