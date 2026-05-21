
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
  SendHorizontal,
  Smartphone
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
  { id: 'mt5_1', name: '332323752', sub: 'MT5', balance: '0.00' },
  { id: 'btc', name: 'Bitcoin (BTC)', sub: 'Crypto', icon: Bitcoin, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
  { id: 'mobile_money', name: 'Mobile Money (Airtel)', sub: 'Mobile', icon: Smartphone, balance: '0.00' },
];

export default function TransferPage() {
  const router = useRouter();
  const [fundingAccount, setFundingAccount] = useState('btc');
  const [destinationAccount, setDestinationAccount] = useState('mt5_1');
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [balance, setBalance] = useState(0);
  const { toast } = useToast();
  
  const amountRef = useRef<HTMLDivElement>(null);
  const selectedFunding = ACCOUNTS.find(a => a.id === fundingAccount);
  const selectedDest = ACCOUNTS.find(a => a.id === destinationAccount);

  useEffect(() => {
    const syncBalance = () => {
      setBalance(Number(localStorage.getItem('user_balance') || '0'));
    };
    syncBalance();
    const interval = setInterval(syncBalance, 2000);
    return () => clearInterval(interval);
  }, []);

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
    
    amountRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsVerifying(true);
    toast({
      title: "ID Submitted",
      description: "Please specify the amount to be credited to your account.",
    });
  };

  const handleSubmitTransfer = () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
      });
      return;
    }

    if (numAmount < 25) {
      toast({
        variant: "destructive",
        title: "Minimum Copy Trade",
        description: "The minimum amount to start copy trading is $25.",
      });
      return;
    }
    
    localStorage.setItem('pending_deposit', JSON.stringify({
      amount: numAmount,
      timestamp: Date.now()
    }));

    toast({
      title: "Submission Received",
      description: "Your deposit will reflect in your dashboard in 3 minutes.",
    });
    
    setIsVerifying(false);
    setTransactionId('');
    setAmount('');
  };

  const handleCopyTradeRedirect = () => {
    if (balance < 25) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "Your deposit has not yet reflected. Please wait for the 3-minute verification period.",
      });
      return;
    }
    router.push('/copied-trades');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC] text-foreground font-body">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-xl">
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-gray-600">Payment method</Label>
              <div className="flex items-center justify-between p-4 bg-white border border-green-500/30 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-black text-white p-1 rounded-full">
                    <ArrowRightLeft className="h-4 w-4 rotate-90" />
                  </div>
                  <span className="font-bold text-gray-800">Between your accounts</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-gray-600">From account</Label>
              <Select value={fundingAccount} onValueChange={setFundingAccount}>
                <SelectTrigger className="h-auto p-4 bg-white border border-green-500/30 rounded-xl flex items-center justify-between hover:bg-muted/10 transition-all shadow-sm">
                  <div className="flex items-center gap-3">
                    {selectedFunding?.id === 'btc' ? (
                       <Bitcoin className="h-5 w-5 text-orange-500" />
                    ) : (
                      <div className="px-2 py-0.5 rounded bg-gray-100 border text-[10px] font-black uppercase tracking-wider">MT5</div>
                    )}
                    <span className="font-bold text-gray-800">{selectedFunding?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">0.00 USD</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNTS.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id} className="cursor-pointer py-3">
                      <div className="flex items-center gap-3">
                         {acc.icon ? <acc.icon className="h-4 w-4" /> : <div className="text-[8px] font-bold">MT5</div>}
                        <span className="font-bold text-sm">{acc.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-gray-600">To account</Label>
              <Select value={destinationAccount} onValueChange={setDestinationAccount}>
                <SelectTrigger className="h-auto p-4 bg-white border border-green-500/30 rounded-xl flex items-center justify-between hover:bg-muted/10 transition-all shadow-sm">
                  <div className="flex items-center gap-3">
                    {selectedDest?.id === 'mt5_1' ? (
                      <div className="px-2 py-0.5 rounded bg-gray-100 border text-[10px] font-black uppercase tracking-wider">MT5</div>
                    ) : (
                       <Smartphone className="h-5 w-5 text-gray-700" />
                    )}
                    <span className="font-bold text-gray-800">{selectedDest?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">0.00 USD</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNTS.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id} className="cursor-pointer py-3">
                      <div className="flex items-center gap-3">
                        {acc.icon ? <acc.icon className="h-4 w-4" /> : <div className="text-[8px] font-bold">MT5</div>}
                        <span className="font-bold text-sm">{acc.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {fundingAccount === 'btc' && (
              <div className="mt-4 p-5 bg-white border border-blue-500/20 rounded-xl shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Deposit Crypto to Fund</p>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="flex-1 font-mono text-[10px] break-all text-gray-500">{selectedFunding?.address}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(selectedFunding?.address!)}>
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input 
                    placeholder="Transaction ID"
                    className="h-11 bg-white border-gray-200"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                  <Button onClick={handleInitialSubmit} className="w-full bg-blue-600 text-white font-bold h-11">
                    Verify Deposit
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-1.5" ref={amountRef}>
              <Label className="text-sm font-bold text-gray-600">Amount</Label>
              <div className="relative">
                <Input 
                  className="h-14 bg-white border-green-500/30 text-xl font-bold pr-14" 
                  placeholder="0.00"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">USD</div>
              </div>
              <p className="text-[10px] font-bold text-blue-600">0.01 USD - 0.00 USD (Reflecting Limit)</p>
            </div>

            <Button 
              disabled={!amount || Number(amount) < 25}
              onClick={handleSubmitTransfer}
              className="w-full h-14 bg-gray-100 text-gray-400 font-bold text-lg rounded-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
            >
              Continue
            </Button>

            <div className="pt-8 space-y-6">
              <section className="space-y-2">
                <h3 className="font-black text-lg">Terms</h3>
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

              <Button 
                onClick={handleCopyTradeRedirect}
                className="w-full h-16 bg-blue-600 text-white font-black uppercase text-xl rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform"
              >
                COPY TRADE
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
