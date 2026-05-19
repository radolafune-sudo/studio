"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowRightLeft, 
  ChevronDown, 
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Bitcoin,
  Coins,
  CircleDollarSign,
  Zap,
  Copy,
  Check
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const ACCOUNTS = [
  { id: 'mt5_1', name: 'Account 332323752', sub: '332323752', balance: '0.00 USD', type: 'MT5' },
  { id: 'mt5_2', name: 'Account 699478516', sub: '699478516', balance: '0.00 USD', type: 'MT5' },
  { id: 'btc', name: 'Crypto wallet (BTC)', sub: 'Bitcoin', balance: '0.00 BTC', color: 'text-orange-500', icon: Bitcoin, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
  { id: 'usdt', name: 'Crypto wallet (USDT TRC20)', sub: 'Tether', balance: '0.00 USDT', color: 'text-green-600', icon: CircleDollarSign, address: 'TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
  { id: 'trx', name: 'TRON (TRX)', sub: 'Tron Network', balance: '0.00 TRX', color: 'text-red-600', icon: Zap, address: 'Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
  { id: 'eth', name: 'Ethereum (ETH)', sub: 'Ether', balance: '0.00 ETH', color: 'text-indigo-600', icon: Coins, address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
  { id: 'usdc', name: 'USD Coin (USDC ERC20)', sub: 'USD Coin', balance: '0.00 USDC', color: 'text-blue-500', icon: CircleDollarSign, address: '0x88dC783616640532925a3b844Bc454e4438f44e' },
];

export default function TransferPage() {
  const [fundingAccount, setFundingAccount] = useState('btc');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-10">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Internal Transfer</h1>
            <p className="text-muted-foreground font-medium">Move funds between your trading accounts instantly.</p>
          </header>

          <div className="flex items-center justify-between p-5 bg-white border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <ArrowRightLeft className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Between your accounts</span>
            </div>
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="space-y-8">
            {/* From Funding Account - Active Dropdown & Features */}
            <div className="space-y-3">
              <Label className="text-muted-foreground font-semibold ml-1 uppercase text-[11px] tracking-wider">FROM YOUR FUNDING ACCOUNT</Label>
              <Select value={fundingAccount} onValueChange={setFundingAccount}>
                <SelectTrigger className="h-auto p-5 bg-white border border-border rounded-xl flex items-center justify-between hover:bg-muted/50 transition-all">
                  <div className="flex items-center gap-4">
                    {selectedFunding?.type === 'MT5' ? (
                      <div className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider">
                        MT5
                      </div>
                    ) : (
                      selectedFunding?.icon && <selectedFunding.icon className={cn("h-6 w-6", selectedFunding.color)} />
                    )}
                    <div className="text-left">
                      <span className="font-mono text-xl tracking-tight text-foreground block leading-none mb-1">
                        {selectedFunding?.type === 'MT5' ? selectedFunding.sub : selectedFunding?.name}
                      </span>
                      {selectedFunding?.type !== 'MT5' && (
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{selectedFunding?.sub}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-lg">{selectedFunding?.balance}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[400px]">
                  {ACCOUNTS.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id} className="cursor-pointer py-3">
                      <div className="flex items-center justify-between w-full min-w-[300px] md:min-w-[500px]">
                        <div className="flex items-center gap-3">
                          {acc.type === 'MT5' ? (
                            <div className="px-2 py-0.5 rounded bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold">MT5</div>
                          ) : (
                            acc.icon && <acc.icon className={cn("h-5 w-5", acc.color)} />
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{acc.type === 'MT5' ? `Account ${acc.sub}` : acc.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-medium">{acc.sub}</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold">{acc.balance}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Wallet Address Display - Now moved to Funding section */}
              {selectedFunding?.address && (
                <div className="mt-4 p-5 bg-primary/5 border border-primary/10 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Your Wallet Address</Label>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-primary/10", selectedFunding.color)}>
                      {selectedFunding.sub} Network
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-border shadow-inner">
                    <span className="flex-1 font-mono text-xs break-all text-muted-foreground font-medium">
                      {selectedFunding.address}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="shrink-0 hover:bg-primary/10 text-primary"
                      onClick={() => handleCopy(selectedFunding.address!)}
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium italic">
                    * Send only {selectedFunding.sub} to this address. Sending any other asset may result in permanent loss of funds.
                  </p>
                </div>
              )}
            </div>

            {/* To Copy Trading Account - Dormant Section as requested */}
            <div className="space-y-3">
              <Label className="text-muted-foreground font-semibold ml-1 uppercase text-[11px] tracking-wider">TO COPY TRADING ACCOUNT</Label>
              <div className="h-auto p-5 bg-white border border-border rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-8">
                  <div className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider">
                    MT5
                  </div>
                  <span className="font-mono text-xl tracking-tight text-foreground font-bold">
                    699478516
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-lg">0.00 USD</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-muted-foreground font-semibold ml-1">Amount</Label>
              <div className="relative group">
                <Input 
                  className="h-20 bg-white border-border text-3xl font-black pr-20 focus-visible:ring-primary rounded-xl" 
                  placeholder="0.00"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xl">
                  {selectedFunding?.balance.split(' ')[1] || 'USD'}
                </div>
              </div>
              <div className="flex justify-between px-1">
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wide">Min: 0.01 {selectedFunding?.balance.split(' ')[1] || 'USD'}</p>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wide">Available: {selectedFunding?.balance}</p>
              </div>
            </div>

            <Button className="w-full h-20 bg-muted text-muted-foreground font-black text-xl hover:bg-muted cursor-not-allowed rounded-full shadow-lg border border-border transition-all">
              Continue
            </Button>
          </div>

          <div className="space-y-10 pt-10 border-t border-border">
            <section className="space-y-4">
              <h3 className="text-2xl font-black tracking-tight">Terms</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="text-muted-foreground font-medium">Average payment time</span>
                  <span className="text-foreground font-black">Instant</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="text-muted-foreground font-medium">Fee</span>
                  <span className="text-foreground font-black">0%</span>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-black tracking-tight text-primary">FAQ</h3>
              <div className="space-y-4">
                <div className="space-y-2 bg-muted/30 p-5 rounded-xl border border-border">
                  <h4 className="font-black text-sm">General transfer rules</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    Funds are debited from the source account and credited to the destination account immediately after a successful transfer. Multi-currency transfers will be converted based on real-time internal rates.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border pt-16 pb-12 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
            <div className="flex flex-wrap gap-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Risk Disclosure</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms and Conditions</Link>
              <Link href="#" className="hover:text-primary transition-colors">AML Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <div key={i} className="p-3 bg-white rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer border border-border shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 text-[11px] text-muted-foreground font-medium leading-relaxed">
            <p>
              JUST MARKETS Capital Incorporation does not provide personalized investment, tax, or legal advice. All information, educational materials, and communications provided by the Company are for general informational purposes only and do not constitute investment advice or recommendations. Customers should ensure they fully understand the nature of Contracts for Difference (CFDs), foreign exchange (FX), and crypto derivative products, as well as the risks involved, before engaging in any trading activity.
            </p>
            <p>
              Customers who are unsure about the risks associated with trading CFDs, FX, or crypto derivatives are strongly encouraged to seek independent advice from a qualified financial advisor prior to making any investment decisions.
            </p>
            <p>
              CFDs, FX, and crypto derivatives are complex financial instruments and come with a high risk of losing money rapidly due to leverage. These products may not be suitable for all investors. The value of investments can fluctuate significantly, and customers may lose some or all of their invested capital. By choosing to trade, customers acknowledge and accept full responsibility for any losses or damages incurred as a result of their trading activities.
            </p>
            <div className="pt-4 text-center opacity-60">
              <p className="font-bold tracking-[0.3em]">&copy; {new Date().getFullYear()} JUST MARKETS. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
