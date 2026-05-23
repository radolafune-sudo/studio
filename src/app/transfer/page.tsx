
'use client';

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
  Activity,
  ArrowLeftRight,
  User as UserIcon,
  Loader2
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUser, useDoc, createDeposit, useCollection } from "@/firebase";
import { cn } from "@/lib/utils";

const CRYPTO_WALLETS = [
  { id: 'btc', name: "CRYPTO WALLET (BTC)", icon: <Bitcoin className="h-5 w-5 text-[#F7931A]" />, symbol: "BTC" },
  { id: 'usdt', name: "CRYPTO WALLET (USDT TRC20)", icon: <CircleDollarSign className="h-5 w-5 text-[#26A17B]" />, symbol: "TRC20" },
  { id: 'trx', name: "TRON (TRX)", icon: <TrendingUp className="h-5 w-5 text-[#FF0013]" />, symbol: "TRX" },
  { id: 'eth', name: "ETHEREUM (ETH)", icon: <Activity className="h-5 w-5 text-[#627EEA]" />, symbol: "ETH" },
  { id: 'usdc', name: "USD COIN (USDC ERC20)", icon: <CircleDollarSign className="h-5 w-5 text-[#2775CA]" />, symbol: "USDC ERC20" }
];

const DEFAULT_WALLETS: Record<string, string> = {
  btc: 'bc1qpd4qdygkd59d5ga04rsrp7l5cyt267568km0sy',
  usdt: 'TQVM4CedoPkY552cZMDntRJcGUHMQHkrPn',
  trx: 'TQVM4CedoPkY552cZMDntRJcGUHMQHkrPn',
  eth: '0x0b17448253736dB9F584978c89578E46C1BfbB4A',
  usdc: '0x0b17448253736dB9F584978c89578E46C1BfbB4A'
};

export default function TransferPage() {
  const router = useRouter();
  const { user } = useUser();
  const [fromListOpen, setFromListOpen] = useState(false);
  const [toListOpen, setToListOpen] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [depositAmount, setDepositAmount] = useState('25');
  const [copyTradeAmount, setCopyTradeAmount] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [selectedToAccount, setSelectedToAccount] = useState('COPY TRADING ACCOUNT');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  
  const userRef = useMemo(() => user?.uid ? `users/${user.uid}` : null, [user]);
  const { data: userProfile } = useDoc(userRef);
  const { data: globalSettings } = useDoc('settings/global');
  const { data: deposits } = useCollection<any>(user ? 'deposits' : null);

  const activeWallet = CRYPTO_WALLETS.find(w => w.id === selectedWalletId);
  
  const walletAddress = useMemo(() => {
    if (!selectedWalletId) return '';
    return globalSettings?.wallets?.[selectedWalletId] || DEFAULT_WALLETS[selectedWalletId] || '';
  }, [globalSettings, selectedWalletId]);

  useEffect(() => {
    const rejectedDeposit = deposits?.find((d: any) => d.userId === user?.uid && d.status === 'rejected');
    if (rejectedDeposit) {
      toast({
        variant: "destructive",
        title: "Deposit Rejected",
        description: "Transaction could not be verified in blockchain. Please contact support.",
        duration: 8000
      });
    }
  }, [deposits, user, toast]);

  const handleCopy = (address: string) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast({ title: "Address Copied", description: "Wallet address has been copied." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitVerification = async () => {
    if (!user) return;
    const numAmount = Number(depositAmount);
    if (!numAmount || numAmount <= 0 || !transactionId) {
      toast({ variant: "destructive", title: "Error", description: "Fill all details correctly." });
      return;
    }

    setIsVerifying(true);
    
    setTimeout(async () => {
      await createDeposit({
        userId: user.uid,
        userEmail: user.email,
        amount: numAmount,
        transactionId: transactionId,
        status: "pending",
        walletType: activeWallet?.name
      });

      setIsVerifying(false);
      setDetailsVisible(false);
      setSelectedWalletId(null);
      setTransactionId('');
      toast({ title: "Verification Submitted", description: "Your transaction is being verified on the blockchain." });
    }, 6000);
  };

  const handleCopyTradeRedirect = () => {
    const balance = userProfile?.balance || 0;
    const amount = Number(copyTradeAmount);
    if (!amount || amount <= 0 || balance < amount) {
      toast({ variant: "destructive", title: "Insufficient Capital", description: "Deposit funds to proceed." });
      return;
    }
    router.push('/copied-trades');
  };

  const handleWalletSelect = (id: string) => {
    setSelectedWalletId(id);
    setFromListOpen(false);
    setDetailsVisible(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC] text-foreground font-body">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-xl space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available Capital</p>
            <p className="text-3xl font-black text-black">${(userProfile?.balance || 0).toFixed(2)}</p>
          </div>
          <Wallet className="h-8 w-8 text-primary/20" />
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment method</Label>
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowLeftRight className="h-4 w-4 text-blue-500" />
                <span className="text-[13px] font-black text-black uppercase tracking-tight">Move funds between your accounts</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">From account</Label>
            <div className="relative">
              <button 
                onClick={() => setFromListOpen(!fromListOpen)}
                className={cn(
                  "w-full h-auto p-4 bg-white text-black border border-gray-200 rounded-xl flex items-center justify-between transition-all hover:bg-gray-50 shadow-[0_0_20px_rgba(34,197,94,0.15)] animate-pulse",
                  fromListOpen ? "ring-2 ring-primary" : ""
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/5 border border-primary/10 px-2 py-0.5 rounded text-[10px] font-black text-primary uppercase tracking-wider">
                    <UserIcon className="h-3 w-3" />
                  </div>
                  <span className="text-[15px] font-black tracking-tight uppercase">
                    {activeWallet ? activeWallet.name : "USER FUNDING METHOD"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-muted-foreground">0.00 USD</span>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", fromListOpen && "rotate-180")} />
                </div>
              </button>

              {fromListOpen && (
                <div className="absolute top-full left-0 w-full z-50 mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl divide-y divide-gray-100 animate-in slide-in-from-top-2 duration-200">
                  {CRYPTO_WALLETS.map((wallet) => (
                    <div 
                      key={wallet.id} 
                      onClick={() => handleWalletSelect(wallet.id)}
                      className={cn(
                        "flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-gray-50",
                        selectedWalletId === wallet.id ? "bg-primary/5" : ""
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">{wallet.icon}</div>
                        <span className="text-[12px] font-black text-black uppercase tracking-tight">{wallet.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">0.00 {wallet.symbol}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {detailsVisible && activeWallet && (
            <div className="bg-white p-8 border border-gray-200 rounded-[2rem] shadow-sm space-y-8 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-6">
                <h2 className="text-[11px] font-black uppercase text-black tracking-widest leading-tight">
                  COPY THE ADDRESS BELOW ({activeWallet.symbol})
                </h2>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-dashed border-gray-300">
                    <span className="flex-1 font-mono text-[11px] break-all text-black font-bold">{walletAddress}</span>
                    <button onClick={() => handleCopy(walletAddress)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border">
                      {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4 text-primary" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-6 border-t border-gray-100">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Amount</Label>
                    <Input 
                      placeholder="25" 
                      type="number" 
                      value={depositAmount} 
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="h-14 bg-white border-gray-300 text-xl font-black rounded-xl text-black"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Transaction ID</Label>
                    <Input 
                      placeholder="Transaction ID" 
                      value={transactionId} 
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="h-14 bg-white border-gray-300 font-mono text-black rounded-xl font-bold"
                    />
                  </div>

                  <Button disabled={isVerifying} onClick={handleSubmitVerification} className="w-full bg-primary text-white font-black uppercase tracking-widest h-16 rounded-2xl shadow-xl shadow-primary/20">
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying Blockchain...
                      </>
                    ) : (
                      "Submit Verification"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">To account</Label>
            <div className="relative">
              <button 
                onClick={() => setToListOpen(!toListOpen)}
                className={cn(
                  "w-full h-auto p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between transition-all hover:bg-gray-50",
                  toListOpen ? "ring-2 ring-primary" : ""
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 px-2 py-0.5 rounded text-[10px] font-black text-primary uppercase tracking-wider">MT5</div>
                  <span className="text-[15px] font-black text-black tracking-tight uppercase">{selectedToAccount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-primary">
                    {selectedToAccount === 'MANUAL TRADING ACCOUNT' ? '0.00' : (userProfile?.balance || 0).toFixed(2)} USD
                  </span>
                  <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", toListOpen && "rotate-180")} />
                </div>
              </button>

              {toListOpen && (
                <div className="absolute top-full left-0 w-full z-50 mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl divide-y divide-gray-100 animate-in slide-in-from-top-2 duration-200">
                  <div 
                    onClick={() => { setSelectedToAccount('COPY TRADING ACCOUNT'); setToListOpen(false); }}
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-all font-black text-[12px] uppercase text-black"
                  >
                    <span>COPY TRADING ACCOUNT</span>
                    <span className="text-primary">${(userProfile?.balance || 0).toFixed(2)}</span>
                  </div>
                  <div 
                    onClick={() => { setSelectedToAccount('MANUAL TRADING ACCOUNT'); setToListOpen(false); }}
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-all font-black text-[12px] uppercase text-black"
                  >
                    <span>MANUAL TRADING ACCOUNT</span>
                    <span className="text-muted-foreground">$0.00</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-primary ml-1">Enter amount of your choice to trade</Label>
              <div className="relative">
                <Input 
                  placeholder="Enter Amount" 
                  type="number" 
                  value={copyTradeAmount} 
                  onChange={(e) => setCopyTradeAmount(e.target.value)}
                  className="h-16 bg-white border-primary/20 rounded-2xl text-2xl font-black px-6 text-black"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-black">USD</span>
              </div>
            </div>
            
            <Button 
              onClick={handleCopyTradeRedirect}
              className="w-full h-16 bg-blue-600 text-white font-black uppercase text-xl rounded-full shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Transfer to MT5
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
