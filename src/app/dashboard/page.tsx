
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  ArrowRightLeft, 
  ArrowUpRight,
  Activity,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Banner 1: Proven Strategy */}
          <Card className="bg-white border border-border overflow-hidden h-[200px] rounded-[1.5rem] flex items-center relative group shadow-sm">
            <CardContent className="p-8 flex justify-between items-center w-full z-10">
              <div className="max-w-full space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-foreground">
                  Ready to start today with a proven strategy?
                </h2>
                <p className="text-sm font-semibold text-accent tracking-wide uppercase">CopyTrade Now!</p>
              </div>
            </CardContent>
          </Card>

          {/* Banner 2: Precision meets performance */}
          <Card className="bg-white border border-border overflow-hidden h-[200px] rounded-[1.5rem] flex items-center relative group shadow-sm">
            <CardContent className="p-8 flex justify-between items-center w-full z-10">
              <div className="max-w-full space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-foreground">
                  Where precision meets performance
                </h2>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Activity className="h-4 w-4" />
                  <span className="text-lg font-mono tracking-tighter">
                    $7,240.50
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Summary Card */}
        <Card className="bg-white text-foreground border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden rounded-[2.5rem]">
          <CardContent className="p-8 md:p-12 space-y-8">
            <div className="flex justify-between items-center">
              {/* Left Side Avatar */}
              <div className="w-12 h-12 bg-[#F1F3F9] rounded-full flex items-center justify-center font-bold text-[#4B5563] text-sm">
                MT
              </div>
              
              {/* Center Balance */}
              <div className="text-center">
                <div className="flex items-start justify-center text-[#1F2937]">
                  <span className="text-2xl font-medium mt-2 mr-1 opacity-50">$</span>
                  <span className="text-7xl font-bold tracking-tight">0.00</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-3">Total Funds</p>
              </div>

              {/* Right Side Notification Bell with Popover */}
              <div className="relative">
                <Popover onOpenChange={(open) => { if(open) setHasNotification(false); }}>
                  <PopoverTrigger asChild>
                    <div className="w-12 h-12 bg-[#F1F3F9] rounded-full flex items-center justify-center cursor-pointer hover:bg-muted transition-colors relative">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      {hasNotification && (
                        <div className="absolute top-0 right-0 h-4 w-4 bg-accent rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm animate-pulse">
                          1
                        </div>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80 p-0 rounded-2xl overflow-hidden shadow-2xl border-none">
                    <div className="bg-primary p-4 text-primary-foreground">
                      <h4 className="font-bold text-sm uppercase tracking-wider">Notifications</h4>
                    </div>
                    <div className="p-4 space-y-4 bg-white">
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-accent" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground leading-tight">Welcome to JUST MARKETS!</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            We're thrilled to have you here. Start exploring our master traders or use our AI Matchmaker to find your perfect strategy.
                          </p>
                          <p className="text-[10px] text-accent font-bold uppercase pt-1">Just Now</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/30 text-center border-t border-border">
                      <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                        View all activity
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Bottom Buttons Container */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/transfer" className="w-full sm:w-[280px]">
                <Button 
                  className="w-full h-[64px] rounded-full bg-primary/10 hover:bg-primary/20 text-primary border-none flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-sm"
                >
                  <ArrowRightLeft className="h-5 w-5" />
                  Transfer
                </Button>
              </Link>
              <Link href="/withdraw" className="w-full sm:w-[280px]">
                <Button 
                  className="w-full h-[64px] rounded-full bg-accent hover:bg-accent/90 text-white flex items-center justify-center gap-3 font-bold text-lg border-none shadow-lg shadow-accent/20 transition-all"
                >
                  <ArrowUpRight className="h-5 w-5" />
                  Withdraw
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
