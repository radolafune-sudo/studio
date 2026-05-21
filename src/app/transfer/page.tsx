
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Copy,
  Check,
  Wallet,
  ChevronDown,
  Bitcoin,
  CircleDollarSign,
  TrendingUp,
  Activity
} from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUser, useDoc, createDeposit } from "@/firebase";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const CRYPTO_WALLETS = [
  { id: 'btc', name: "Crypto wallet (BTC)", icon: <Bitcoin className="h-5 w-5 text-[#F7931A]" />, symbol: "BTC" },
  { id: 'usdt', name: "Crypto wallet (USDT TRC20)", icon: <CircleDollarSign className="h-5 w-5 text-[#26A17B]" />, symbol: "USDT" },
  { id: 'trx', name: "TRON (TRX)", icon: <TrendingUp className="h-5 w-5 text-[#FF0013]" />, symbol: "TRX" },
  { id: 'eth', name: "Ethereum (ETH)", icon: <Activity className="h-5 w-5 text-[#627EEA]" />, symbol: "ETH" },
  { id: 'usdc', name: "USD Coin (USDC ERC20)", icon: <CircleDollarSign className="h-5 w-5 text-[#2775CA]" />, symbol: "USDC" }
];

export default function TransferPage() {
  const router = useRouter();
  const { user } = useUser();
  const [fundingOpen, setFundingOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [depositAmount, setDepositAmount] = useState('25');
  const [copyTradeAmount, setCopyTradeAmount] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState('btc');
  const { toast } = useToast();
  
  const userRef = useMemo(() => user?.uid ? `users/${user.uid}` : null, [user]);
  const { data: userProfile } = useDoc(userRef);
  const { data: globalSettings } = useDoc('settings/global');
  
  const activeWallet = CRYPTO_WALLETS.find(w => w.id === selectedWalletId);
  const walletAddress = globalSettings?.wallets?.[selectedWalletId] || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast({ title: "Address Copied", description: "Wallet address has been copied to your clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitVerification = async () => {
    if (!user) return;
    const numAmount = Number(depositAmount);
    if (!numAmount || numAmount <= 0 || !transactionId) {
      toast({ variant: "destructive", title: "Error", description: "Fill all details correctly." });
      return;
    }

    createDeposit({
      userId: user.uid,
      userEmail: user.email,
      amount: numAmount,
      transactionId: transactionId,
      status: "pending",
      walletType: activeWallet?.name
    });

    toast({ title: "Submission Received", description: "Admin will review and approve your deposit shortly." });
    setFundingOpen(false);
  };

  const handleCopyTradeRedirect = () => {
    const balance = userProfile?.balance || 0;
    const amount = Number(copyTradeAmount);
    if (!amount || amount <= 0 || balance < amount) {
      toast({ variant: "destructive", title: "Error", description: "Insufficient capital." });
      return;
    }
    router.push('/copied-trades');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC] text-foreground font-body">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-xl">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available Capital</p>
              <p className="text-3xl font-black text-black">${(userProfile?.balance || 0).toFixed(2)}</p>
            </div>
            <Wallet className="h-8 w-8 text-primary/20" />
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-bold text-gray-600">From account</Label>
            <Collapsible open={fundingOpen} onOpenChange={setFundingOpen} className="w-full">
              <CollapsibleTrigger asChild>
                <button className={cn(
                  "w-full h-auto p-2 bg-[#0A0A0A] border border-gray-800 rounded-2xl flex flex-col gap-1 transition-all",
                  fundingOpen ? "ring-2 ring-primary" : ""
                )}>
                  {CRYPTO_WALLETS.map((wallet) => (
                    <div 
                      key={wallet.id} 
                      onClick={(e) => {
                        if (fundingOpen) {
                          e.stopPropagation();
                          setSelectedWalletId(wallet.id);
                        }
                      }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl transition-all",
                        selectedWalletId === wallet.id ? "bg-white/10" : "hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">{wallet.icon}</div>
                        <span className="text-[11px] font-black text-white uppercase tracking-tight">{wallet.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">0.00 {wallet.symbol}</span>
                    </div>
                  ))}
                  <div className="flex justify-center py-1">
                    <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", fundingOpen && "rotate-180")} />
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 animate-in slide-in-from-top-2 duration-300">
                <div className="bg-white p-8 border border-gray-100 rounded-[2.5rem] shadow-2xl space-y-8">
                  <div className="space-y-6">
                    <h2 className="text-sm font-black uppercase text-black tracking-widest leading-tight">DEPOSIT TO FUND YOUR COPY TRADING ACCOUNT</h2>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">copy the address below ({activeWallet?.symbol})</p>
                      <div className="flex items-center gap-3 bg-muted/30 p-4 rounded-xl border border-dashed border-gray-200">
                        <span className="flex-1 font-mono text-[11px] break-all text-black font-bold">{walletAddress}</span>
                        <button onClick={() => handleCopy(walletAddress)} className="p-3 bg-white hover:bg-muted/50 rounded-lg transition-colors shadow-sm">
                          {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4 text-primary" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 pt-6 border-t border-muted/30">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Amount (USD)</Label>
                        <Input 
                          placeholder="25" type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)}
                          className="h-14 bg-muted/20 border-none text-xl font-black rounded-xl text-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Transaction ID</Label>
                        <Input 
                          placeholder="tyfugfigop" value={transactionId} onChange={(e) => setTransactionId(e.target.value)}
                          className="h-14 bg-muted/20 border-none font-mono text-black rounded-xl font-bold"
                        />
                      </div>
                      <Button onClick={handleSubmitVerification} className="w-full bg-primary text-white font-black uppercase tracking-widest h-16 rounded-2xl shadow-xl shadow-primary/20">
                        Submit Verification
                      </Button>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="space-y-1.5 opacity-60">
            <Label className="text-sm font-bold text-gray-600">To account</Label>
            <div className="h-auto p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className="px-2 py-0.5 rounded bg-gray-100 border text-[10px] font-black uppercase tracking-wider">MT5</div>
                <span className="font-bold text-gray-800">{user?.uid?.slice(0, 9).toUpperCase() || "332323752"}</span>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-primary ml-1">Enter amount to copy trade</Label>
              <div className="relative">
                <Input 
                  placeholder="Enter Amount" type="number" value={copyTradeAmount} onChange={(e) => setCopyTradeAmount(e.target.value)}
                  className="h-16 bg-white border-primary/20 rounded-2xl text-2xl font-black px-6 text-black"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-black">USD</span>
              </div>
            </div>
            <Button 
              onClick={handleCopyTradeRedirect}
              className="w-full h-16 bg-blue-600 text-white font-black uppercase text-xl rounded-full shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              COPY TRADE
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
