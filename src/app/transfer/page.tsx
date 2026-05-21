
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowRightLeft, 
  Bitcoin,
  Copy,
  Check,
  Coins,
  Globe,
  Wallet,
  ChevronDown
} from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUser, useDoc, createDeposit } from "@/firebase";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export default function TransferPage() {
  const router = useRouter();
  const { user } = useUser();
  const [fundingOpen, setFundingOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [copyTradeAmount, setCopyTradeAmount] = useState('');
  const { toast } = useToast();
  
  const userRef = useMemo(() => user?.uid ? `users/${user.uid}` : null, [user]);
  const { data: userProfile } = useDoc(userRef);
  
  // Real-time wallet address from admin settings
  const { data: globalSettings } = useDoc('settings/global');
  const walletAddress = globalSettings?.walletAddress || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast({
      title: "Address Copied",
      description: "Wallet address has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitVerification = async () => {
    if (!user) return;
    
    const numAmount = Number(depositAmount);
    if (!numAmount || numAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
      });
      return;
    }

    if (!transactionId) {
      toast({
        variant: "destructive",
        title: "Missing Transaction ID",
        description: "Please provide the Transaction ID for verification.",
      });
      return;
    }

    await createDeposit({
      userId: user.uid,
      userEmail: user.email,
      amount: numAmount,
      transactionId: transactionId,
      status: "pending",
    });

    localStorage.setItem(`pending_deposit_${user.uid}`, JSON.stringify({
      amount: numAmount,
      timestamp: Date.now()
    }));

    toast({
      title: "Submission Received",
      description: "Your deposit will reflect in your dashboard in 3 minutes.",
    });

    setFundingOpen(false);
  };

  const handleCopyTradeRedirect = () => {
    const balance = userProfile?.balance || 0;
    const amount = Number(copyTradeAmount);
    
    if (!amount || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter the amount you want to copy trade.",
      });
      return;
    }

    if (balance < amount) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: `You only have $${balance.toFixed(2)} available. Please enter a lower amount or fund your account.`,
      });
      return;
    }

    router.push('/copied-trades');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC] text-foreground font-body">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-xl">
        <div className="space-y-6">
          {/* Available Capital - MOVED TO TOP */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available Capital</p>
              <p className="text-3xl font-black">${(userProfile?.balance || 0).toFixed(2)}</p>
            </div>
            <Wallet className="h-8 w-8 text-primary/20" />
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-bold text-gray-600">From account</Label>
            
            <Collapsible open={fundingOpen} onOpenChange={setFundingOpen} className="w-full">
              <CollapsibleTrigger asChild>
                <button className={cn(
                  "w-full h-auto p-5 bg-[#0A0A0A] border rounded-2xl flex items-center justify-between transition-all",
                  fundingOpen ? "border-accent ring-1 ring-accent/30" : "border-gray-800"
                )}>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[11px] font-black tracking-tight uppercase">
                      MT5
                    </div>
                    <span className="font-bold text-white text-lg">332323752</span>
                  </div>
                  <ChevronDown className={cn("h-5 w-5 text-gray-500 transition-transform", fundingOpen && "rotate-180")} />
                </button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-2 animate-in slide-in-from-top-2 duration-300">
                <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-lg space-y-6">
                  <div className="space-y-4">
                    <p className="text-[12px] font-black uppercase text-blue-600 tracking-widest">DEPOSIT TO FUND YOUR COPY TRADING ACCOUNT</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">copy the address below</p>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="flex-1 font-mono text-[10px] break-all text-gray-500">{walletAddress}</span>
                      <button title="copy address" onClick={() => handleCopy(walletAddress)} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-dashed">
                      <div className="space-y-1">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount</Label>
                         <Input 
                          placeholder="25"
                          type="number"
                          className="h-12 bg-white border-gray-200 text-lg font-bold"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Transaction ID</Label>
                        <Input 
                          placeholder="tyfugfigop"
                          className="h-12 bg-white border-gray-200 font-mono"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleSubmitVerification} className="w-full bg-blue-600 text-white font-black uppercase tracking-widest h-14 rounded-xl shadow-md mt-2">
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
                <span className="font-bold text-gray-800">332323752</span>
              </div>
            </div>
          </div>

          {/* New Custom Copy Trade Amount Section */}
          <div className="pt-8 space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-primary ml-1">Enter amount to copy trade</Label>
              <div className="relative">
                <Input 
                  placeholder="Enter Amount"
                  type="number"
                  className="h-16 bg-white border-primary/20 rounded-2xl text-2xl font-black px-6"
                  value={copyTradeAmount}
                  onChange={(e) => setCopyTradeAmount(e.target.value)}
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

          {/* Footer Terms & FAQ - AT THE VERY BOTTOM */}
          <div className="space-y-8 border-t pt-8">
            <section className="space-y-2">
              <h3 className="font-black text-lg uppercase">Terms</h3>
              <div className="text-sm space-y-1">
                <p className="text-gray-500 font-medium">Average payment time <span className="text-black font-bold">Instant</span></p>
                <p className="text-gray-500 font-medium">Fee <span className="text-black font-bold">0%</span></p>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="font-black text-lg uppercase tracking-tight">FAQ</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-800">General transfer rules</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Funds are debited from the source account and credited to the destination account after a successful transfer.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
