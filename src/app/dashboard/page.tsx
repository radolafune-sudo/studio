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
  CheckCircle2,
} from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser, useDoc, useCollection } from "@/firebase";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const userPath = user ? `users/${user.uid}` : null;
  const { data: userProfile, loading: profileLoading } = useDoc(userPath);
  
  const { data: messages } = useCollection<any>(user ? 'support_messages' : null);
  const userMessages = (messages || []).filter(m => m.userId === user?.uid);
  const hasUnread = userMessages.length > 0 && userMessages[userMessages.length - 1].isAdmin;

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Activity className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-white border border-border h-[200px] rounded-[1.5rem] flex items-center relative shadow-sm overflow-hidden">
            <CardContent className="p-8 w-full">
              <div className="space-y-1">
                <h3 className="text-black font-black text-2xl md:text-3xl tracking-tight leading-tight">
                  Ready to start today with <br /> a proven strategy?
                </h3>
                <p className="text-black font-black uppercase text-xs tracking-[0.2em] mt-2">
                  CopyTrade Now!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-border h-[200px] rounded-[1.5rem] flex items-center relative shadow-sm">
            <CardContent className="p-8 flex justify-between items-center w-full">
              <div className="max-w-full space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-foreground">
                  Where precision meets performance
                </h2>
                <div className="flex items-center gap-2 text-primary font-bold opacity-70">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-black uppercase tracking-widest">Trade with 3.5X less slippage</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white text-foreground border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden rounded-[2.5rem]">
          <CardContent className="p-8 md:p-12 space-y-8">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-[#F1F3F9] rounded-full flex items-center justify-center font-bold text-[#4B5563] text-sm uppercase">
                {userProfile?.name?.slice(0, 2) || "JD"}
              </div>
              
              <div className="text-center">
                <div className="flex items-start justify-center text-[#1F2937]">
                  <span className="text-2xl font-medium mt-2 mr-1 opacity-50">$</span>
                  <span className="text-7xl font-bold tracking-tight">{(userProfile?.balance || 0).toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-3">Total Funds</p>
              </div>

              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="w-12 h-12 bg-[#F1F3F9] rounded-full flex items-center justify-center cursor-pointer hover:bg-muted transition-colors relative">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      {hasUnread && (
                        <div className="absolute top-0 right-0 h-4 w-4 bg-[#EF4444] rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm animate-pulse">
                          1
                        </div>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80 p-0 rounded-2xl overflow-hidden shadow-2xl border-none">
                    <div className="bg-primary p-4 text-primary-foreground">
                      <h4 className="font-bold text-sm uppercase tracking-wider">Notifications</h4>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-accent" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground leading-tight">System Notification</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {hasUnread ? "You have a new support message." : "Welcome to JUST MARKETS platform."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <NextLink href="/transfer" className="w-full sm:w-[220px]">
                <Button className="w-full h-[64px] rounded-full bg-accent hover:bg-accent/90 text-white border-none flex items-center justify-center gap-3 font-bold text-lg shadow-lg glow-green">
                  <ArrowRightLeft className="h-5 w-5" /> Transfer to MT5
                </Button>
              </NextLink>
              <NextLink href="/withdraw" className="w-full sm:w-[220px]">
                <Button className="w-full h-[64px] rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-3 font-bold text-lg border-none shadow-lg glow-blue">
                  <ArrowUpRight className="h-5 w-5" /> Withdraw
                </Button>
              </NextLink>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}