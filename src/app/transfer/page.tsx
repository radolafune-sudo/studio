
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
  Linkedin
} from "lucide-react";
import Link from "next/link";

export default function TransferPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-10">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Internal Transfer</h1>
            <p className="text-muted-foreground">Move funds between your trading accounts instantly.</p>
          </header>

          {/* Header Action Selector */}
          <div className="flex items-center justify-between p-5 bg-white border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <ArrowRightLeft className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Between your accounts</span>
            </div>
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Transfer Form Details */}
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-muted-foreground font-semibold ml-1">From account</Label>
              <div className="p-5 bg-white border border-border rounded-xl flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider">
                    MT5
                  </div>
                  <span className="font-mono text-xl tracking-tight text-foreground">332323752</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-lg">0.00 USD</span>
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-muted-foreground font-semibold ml-1">To account</Label>
              <div className="p-5 bg-white border border-border rounded-xl flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider">
                    MT5
                  </div>
                  <span className="font-mono text-xl tracking-tight text-foreground">699478516</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-lg">0.00 USD</span>
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
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
                  USD
                </div>
              </div>
              <div className="flex justify-between px-1">
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wide">Min: 0.01 USD</p>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wide">Available: 0.00 USD</p>
              </div>
            </div>

            <Button className="w-full h-20 bg-muted text-muted-foreground font-black text-xl hover:bg-muted cursor-not-allowed rounded-full shadow-lg border border-border">
              Continue
            </Button>
          </div>

          {/* Detailed Info Sections */}
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

      {/* Global Disclaimer Footer */}
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
