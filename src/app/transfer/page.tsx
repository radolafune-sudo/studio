
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
  Wallet
} from "lucide-react";
import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore";

const CRYPTO_ACCOUNTS = [
  { id: 'btc', name: 'Crypto wallet (BTC)', sub: 'BTC', icon: Bitcoin, color: '#F7931A', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
  { id: 'usdt_trc20', name: 'Crypto wallet (USDT TRC20)', sub: 'USDT', icon: Coins, color: '#26A17B', address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' },
  { id: 'trx', name: 'TRON (TRX)', sub: 'TRX', icon: Globe, color: '#FF0013', address: 'T9yD63u1pYj9S9WfS7tG8S1S1S1S1S1S1S' },
  { id: 'eth', name: 'Ethereum (ETH)', sub: 'ETH', icon: Wallet, color: '#627EEA', address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
  { id: 'usdc_erc20', name: 'USD Coin (USDC ERC20)', sub: 'USDC', icon: Coins, color: '#2775CA', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
];

export default function TransferPage() {
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const [fundingAccount, setFundingAccount] = useState('btc');
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const { toast } = useToast();
  
  const userRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);
  
  const { data: userProfile } = useDoc(userRef);

  const selectedFunding = CRYPTO_ACCOUNTS.find(a => a.id === fundingAccount);

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
    if (!user || !db) return;
    
    const numAmount = Number(amount);
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

    addDoc(collection(db, "deposits"), {
      userId: user.uid,
      userEmail: user.email,
      amount: numAmount,
      transactionId: transactionId,
      status: "pending",
      timestamp: serverTimestamp()
    });

    localStorage.setItem(`pending_deposit_${user.uid}`, JSON.stringify({
      amount: numAmount,
      timestamp: Date.now()
    }));

    toast({
      title: "Submission Received",
      description: "Your deposit will reflect in your dashboard in 3 minutes.",
    });
  };

  const handleCopyTradeRedirect = () => {
    const balance = userProfile?.balance || 0;
    if (balance < 25) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "The minimum copy trade amount is $25. Your deposit may still be pending verification.",
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
              <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-black text-white p-1 rounded-full">
                    <ArrowRightLeft className="h-4 w-4 rotate-90" />
                  </div>
                  <span className="font-bold text-gray-800">Between your accounts</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-5 bg-white border border-green-500/20 rounded-xl shadow-sm space-y-6">
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-gray-600">From account</Label>
                <Select value={fundingAccount} onValueChange={setFundingAccount}>
                  <SelectTrigger className="h-auto p-4 bg-white border border-green-500/30 rounded-xl flex items-center justify-between hover:bg-muted/10 transition-all shadow-sm animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                    <div className="flex items-center gap-3">
                      {selectedFunding?.icon && <selectedFunding.icon className="h-5 w-5" style={{ color: selectedFunding.color }} />}
                      <span className="font-bold text-gray-800">{selectedFunding?.name}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {CRYPTO_ACCOUNTS.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id} className="cursor-pointer py-3">
                        <div className="flex items-center justify-between w-full gap-8">
                          <div className="flex items-center gap-3">
                            {acc.icon && <acc.icon className="h-4 w-4" style={{ color: acc.color }} />}
                            <span className="font-bold text-sm">{acc.name}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <p className="text-[12px] font-black uppercase text-blue-600 tracking-widest">DEPOSIT TO FUND YOUR COPY TRADING ACCOUNT</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">copy the address below</p>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="flex-1 font-mono text-[10px] break-all text-gray-500">{selectedFunding?.address}</span>
                  <button title="copy address" onClick={() => handleCopy(selectedFunding?.address!)} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="space-y-1">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount</Label>
                     <Input 
                      placeholder="0.00"
                      type="number"
                      className="h-11 bg-white border-gray-200"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Transaction ID</Label>
                    <Input 
                      placeholder="Transaction ID"
                      className="h-11 bg-white border-gray-200"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSubmitVerification} className="w-full bg-blue-600 text-white font-bold h-11 rounded-xl shadow-md">
                    Submit Verification
                  </Button>
                </div>
              </div>
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

            <div className="pt-8 space-y-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available Capital</p>
                  <p className="text-3xl font-black">${(userProfile?.balance || 0).toFixed(2)}</p>
                </div>
                <Wallet className="h-8 w-8 text-primary/20" />
              </div>

              <Button 
                onClick={handleCopyTradeRedirect}
                className="w-full h-16 bg-blue-600 text-white font-black uppercase text-xl rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform"
              >
                COPY TRADE
              </Button>

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
          </div>
        </div>
      </main>
    </div>
  );
}
