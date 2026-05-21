"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowRightLeft, 
  ChevronDown, 
  Bitcoin,
  Coins,
  CircleDollarSign,
  Copy,
  Check,
  SendHorizontal
} from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const ACCOUNTS = [
  { id: 'mt5_1', name: 'Account 699478516', sub: '699478516', type: 'MT5' },
  { id: 'btc', name: 'Crypto wallet (BTC)', sub: 'Bitcoin', color: 'text-orange-500', icon: Bitcoin, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
  { id: 'usdt', name: 'Crypto wallet (USDT TRC20)', sub: 'Tether', color: 'text-green-600', icon: CircleDollarSign, address: 'TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
  { id: 'eth', name: 'Ethereum (ETH)', sub: 'Ether', color: 'text-indigo-600', icon: Coins, address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
];

export default function TransferPage() {
  const router = useRouter();
  const [fundingAccount, setFundingAccount] = useState('mt5_1');
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const { toast } = useToast();
  
  const amountRef = useRef<HTMLDivElement>(null);

  const selectedFunding = ACCOUNTS.find(a => a.id === fundingAccount);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast({
      title: "Address Copied",
      description: "Wallet address has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInitialSubmit = () => {
    if (!transactionId) {
      toast({
        variant: "destructive",
        title: "Missing Transaction ID",
        description: "Please provide the Transaction ID for verification.",
      });
      return;
    }
    
    // Auto-scroll to amount section
    amountRef.current?.scrollIntoView({ behavior: 'smooth' });
    toast({
      title: "ID Verified",
      description: "Please specify the amount to complete your trade.",
    });
  };

  const handleSubmitTrade = () => {
    if (!amount) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide an amount to continue.",
      });
      return;
    }
    
    toast({
      title: "Submission Received",
      description: "Your request is now being reviewed by our compliance team.",
    });
    
    setTimeout(() => {
      router.push('/copied-trades');
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-10">
          <header className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight text-primary uppercase">Internal Transfer</h1>
            <p className="text-muted-foreground font-medium">Move funds between your trading accounts instantly.</p>
          </header>

          <div className="flex items-center justify-between p-5 bg-white border border-border rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <ArrowRightLeft className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Between your accounts</span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-muted-foreground font-black ml-1 uppercase text-[11px] tracking-[0.2em]">FROM YOUR FUNDING ACCOUNT</Label>
              <Select value={fundingAccount} onValueChange={setFundingAccount}>
                <SelectTrigger className="h-auto p-5 bg-white border border-border rounded-xl flex items-center justify-between hover:bg-muted/50 transition-all shadow-sm ring-1 ring-primary/10 animate-pulse hover:animate-none">
                  <div className="flex items-center gap-4">
                    {selectedFunding?.type === 'MT5' ? (
                      <div className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider">MT5</div>
                    ) : (
                      selectedFunding?.icon && <selectedFunding.icon className={cn("h-6 w-6", selectedFunding.color)} />
                    )}
                    <div className="text-left">
                      <span className="font-mono text-xl tracking-tight text-foreground block leading-none mb-1 font-bold">
                        {selectedFunding?.type === 'MT5' ? `Account ${selectedFunding.sub}` : selectedFunding?.name}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 text-muted-foreground hidden" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNTS.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id} className="cursor-pointer py-3">
                      <div className="flex items-center gap-3">
                        {acc.type === 'MT5' ? (
                          <div className="px-2 py-0.5 rounded bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold">MT5</div>
                        ) : (
                          acc.icon && <acc.icon className={cn("h-5 w-5", acc.color)} />
                        )}
                        <span className="font-bold text-sm">{acc.type === 'MT5' ? `Account ${acc.sub}` : acc.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedFunding?.address && (
                <div className="mt-4 p-6 bg-white border border-border rounded-2xl shadow-sm space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[11px] text-primary font-black uppercase tracking-[0.2em]">
                      USE THE WALLET BELOW TO FUND YOUR COPY TRADING ACCOUNT
                    </Label>
                    <div className="flex items-center gap-3 bg-muted/30 p-4 rounded-xl border border-border">
                      <span className="flex-1 font-mono text-xs break-all text-muted-foreground font-bold">
                        {selectedFunding.address}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(selectedFunding.address!)}>
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Transaction ID (TXID)</Label>
                    <div className="relative">
                      <Input 
                        placeholder="Paste Hash..."
                        className="h-12 bg-background border-border pl-10 focus-visible:ring-primary"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                      <SendHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <Button onClick={handleInitialSubmit} className="w-full h-14 bg-primary text-white font-black uppercase tracking-wider">
                    Submit Verification
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3" ref={amountRef}>
              <Label className="text-muted-foreground font-black ml-1 uppercase text-[11px] tracking-[0.2em]">AMOUNT TO TRADE</Label>
              <div className="relative group">
                <Input 
                  className="h-20 bg-white border-border text-3xl font-black pr-24 focus-visible:ring-primary rounded-xl shadow-inner" 
                  placeholder="0.00"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xl">USD</div>
              </div>
            </div>

            <Button 
              onClick={handleSubmitTrade}
              className="w-full h-20 bg-primary text-primary-foreground font-black text-2xl hover:bg-primary/90 rounded-full shadow-xl uppercase tracking-widest"
            >
              COPY TRADE
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}