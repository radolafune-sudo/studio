
"use client";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Star, 
  ArrowUpRight,
  ShieldAlert,
  Settings2,
  Users
} from "lucide-react";
import Image from "image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUser, useDoc } from "@/firebase";

const INITIAL_TRADERS = [
  { id: 1, name: "Alex Sterling", strategy: "Elite Scalp Master", assets: ["Forex", "XAUUSD"], risk: 2, return: 84.5, successRate: 92.4, followers: 12402, avatar: "https://picsum.photos/seed/t1/100/100" },
  { id: 2, name: "Elena Vance", strategy: "Precision Alpha", assets: ["Indices", "BTC"], risk: 3, return: 112.8, successRate: 94.1, followers: 8560, avatar: "https://picsum.photos/seed/t2/100/100" },
  { id: 3, name: "Marcus Chen", strategy: "Global Macro Growth", assets: ["Forex", "Oil"], risk: 2, return: 62.1, successRate: 89.7, followers: 4320, avatar: "https://picsum.photos/seed/t3/100/100" },
  { id: 4, name: "Sarah Jenkins", strategy: "Dividend Safe Haven", assets: ["Stocks"], risk: 2, return: 14.2, successRate: 81.2, followers: 2100, avatar: "https://picsum.photos/seed/t4/100/100" },
  { id: 5, name: "Julian Rosso", strategy: "Volatility Arb", assets: ["Options"], risk: 7, return: 65.4, successRate: 59.8, followers: 432, avatar: "https://picsum.photos/seed/t5/100/100" },
  { id: 6, name: "The Quant Fund", strategy: "Algo Scaling", assets: ["All Markets"], risk: 5, return: 38.9, successRate: 64.2, followers: 1560, avatar: "https://picsum.photos/seed/t6/100/100" }
];

export default function TraderDiscovery() {
  const [traders, setTraders] = useState(INITIAL_TRADERS);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const userRef = useMemo(() => user?.uid ? `users/${user.uid}` : null, [user]);
  const { data: userProfile } = useDoc(userRef);

  useEffect(() => {
    const statsInterval = setInterval(() => {
      setTraders(prev => prev.map(t => ({
        ...t,
        return: t.return + (Math.random() > 0.5 ? 0.01 : -0.005),
        successRate: Math.min(99.9, Math.max(50, t.successRate + (Math.random() > 0.5 ? 0.02 : -0.02))),
        followers: t.followers + (Math.random() > 0.95 ? 1 : 0)
      })));
    }, 1000);

    return () => clearInterval(statsInterval);
  }, []);

  const handleCopyAction = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const balance = userProfile?.balance || 0;
    if (balance < 25) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "A minimum of $25 capital is required to start copy trading. Please fund your account.",
      });
      router.push('/transfer');
    } else {
      router.push('/copied-trades');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2 text-foreground">Discover Master Traders</h1>
          <p className="text-muted-foreground font-medium">Browse top performers and start copying their successful strategies.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10 h-14 rounded-2xl bg-white border-none shadow-sm font-medium" placeholder="Search by name, strategy or market..." />
          </div>
          <Button variant="outline" className="flex items-center gap-2 h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] border-none shadow-sm bg-white">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="flex items-center gap-2 h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] border-none shadow-sm bg-white">
            <Settings2 className="h-4 w-4" />
            Sort By: Return
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {traders.map((trader) => (
            <Card key={trader.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all rounded-[2.5rem] bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/10">
                      <img 
                        src={trader.avatar} 
                        alt={trader.name} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                        {trader.name}
                      </CardTitle>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{trader.strategy}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-[#F8FAFC] border-none font-bold text-xs py-1.5 px-3">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    4.9
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Total Return</p>
                    <p className="text-2xl font-mono font-black text-primary">
                      +{trader.return.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Risk Score</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-mono font-black">{trader.risk}/10</span>
                      {trader.risk > 7 && <ShieldAlert className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {trader.assets.map(asset => (
                    <Badge key={asset} variant="secondary" className="font-bold uppercase text-[9px] tracking-widest bg-primary/5 text-primary border-none">
                      {asset}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest pt-2 border-t text-muted-foreground">
                  <span className="flex items-center gap-1">Success: <span className="text-foreground">{trader.successRate.toFixed(1)}%</span></span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {trader.followers.toLocaleString()}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-8 px-6 flex gap-3">
                <Button onClick={handleCopyAction} className="flex-1 h-14 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-accent/20 border-none glow-green">
                  Copy Trader
                </Button>
                <Button variant="outline" size="icon" onClick={handleCopyAction} className="h-14 w-14 shrink-0 rounded-2xl border-none bg-[#F8FAFC] hover:bg-muted text-muted-foreground shadow-sm">
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
