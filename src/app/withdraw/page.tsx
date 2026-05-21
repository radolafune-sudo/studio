
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ShieldCheck, Wallet, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function WithdrawPage() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setBalance(Number(localStorage.getItem('user_balance') || '0'));
  }, []);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (numAmount < 101) {
      toast({
        variant: "destructive",
        title: "Minimum Withdrawal",
        description: "The minimum withdrawal amount is $101.00 USD.",
      });
      return;
    }

    if (numAmount > balance) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: "You do not have enough capital for this withdrawal.",
      });
      return;
    }

    toast({
      title: "Request Pending",
      description: "Our compliance team will review your withdrawal request within 24 hours.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="space-y-8">
          <header className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
              <ArrowUpRight className="h-8 w-8 text-accent" />
              Funds Withdrawal
            </h1>
            <p className="text-muted-foreground font-medium">Securely transfer your earnings to your external wallet.</p>
          </header>

          <Card className="bg-accent/5 border-accent/20 rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-1">Available to Withdraw</p>
                <p className="text-5xl font-black font-mono tracking-tighter">${balance.toFixed(2)}</p>
              </div>
              <Wallet className="h-12 w-12 text-accent/20" />
            </CardContent>
          </Card>

          <div className="bg-muted/30 p-6 rounded-2xl border border-border flex items-start gap-4">
            <Info className="h-5 w-5 text-primary shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">Compliance Policy</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The minimum withdrawal limit is established at **$101.00 USD** to ensure network fee stability. Processing typically takes 2-4 hours.
              </p>
            </div>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Wallet Address (BTC / USDT / ETH)</Label>
              <Input 
                required 
                placeholder="Paste your destination address" 
                className="h-14 bg-white border-border rounded-xl font-mono text-xs" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Withdrawal Amount (USD)</Label>
              <div className="relative">
                <Input 
                  required 
                  type="number" 
                  placeholder="0.00" 
                  className="h-16 bg-white border-border rounded-xl text-2xl font-black pr-16" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-muted-foreground">USD</span>
              </div>
            </div>

            <Button type="submit" className="w-full h-16 bg-accent text-white font-black uppercase tracking-widest text-lg rounded-2xl shadow-xl shadow-accent/20">
              <ShieldCheck className="mr-2 h-6 w-6" />
              Secure Withdrawal
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
