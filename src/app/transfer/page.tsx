
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowRightLeft, 
  ChevronDown, 
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import Link from "next/link";

export default function TransferPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Header Action */}
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
              <ArrowRightLeft className="h-5 w-5 text-accent" />
              <span className="font-semibold">Between your accounts</span>
            </div>
            <ChevronDown className="h-5 w-5 text-slate-500" />
          </div>

          {/* Transfer Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-400 font-medium">From account</Label>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="px-2 py-0.5 rounded border border-accent/50 text-accent text-[10px] font-bold">
                    MT5
                  </div>
                  <span className="font-mono text-lg">332323752</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">0.00 USD</span>
                  <ChevronDown className="h-5 w-5 text-slate-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 font-medium">To account</Label>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="px-2 py-0.5 rounded border border-accent/50 text-accent text-[10px] font-bold">
                    MT5
                  </div>
                  <span className="font-mono text-lg">699478516</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">0.00 USD</span>
                  <ChevronDown className="h-5 w-5 text-slate-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 font-medium">Amount</Label>
              <div className="relative">
                <Input 
                  className="h-16 bg-white/5 border-white/10 text-2xl font-bold pr-16 focus-visible:ring-accent" 
                  placeholder="0.00"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  USD
                </div>
              </div>
              <p className="text-[10px] text-slate-500 px-1">0.01 USD - 0.00 USD</p>
            </div>

            <Button className="w-full h-16 bg-slate-900 text-slate-600 font-bold text-lg hover:bg-slate-900 cursor-not-allowed">
              Continue
            </Button>
          </div>

          {/* Information Sections */}
          <div className="space-y-8 pt-8 border-t border-white/5">
            <section className="space-y-3">
              <h3 className="text-xl font-bold">Terms</h3>
              <div className="space-y-1">
                <p className="text-slate-400">Average payment time <span className="text-white font-bold ml-2">Instant</span></p>
                <p className="text-slate-400">Fee <span className="text-white font-bold ml-2">0%</span></p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold">FAQ</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-bold">General transfer rules</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Funds are debited from the source account and credited to the destination account after a successful transfer.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Internal Page Footer */}
      <footer className="mt-auto border-t border-white/5 pt-12 pb-8 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="flex flex-wrap gap-6 text-xs font-bold text-slate-400">
              <Link href="#" className="hover:text-white">Risk Disclosure</Link>
              <Link href="#" className="hover:text-white">Terms and Conditions</Link>
              <Link href="#" className="hover:text-white">AML Policy</Link>
              <Link href="#" className="hover:text-white">Privacy Policy</Link>
            </div>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <div key={i} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all cursor-pointer">
                  <Icon className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 text-[10px] text-slate-500 leading-relaxed max-w-5xl">
            <p>
              JUST MARKETS Capital Incorporation does not provide personalized investment, tax, or legal advice. All information, educational materials, and communications provided by the Company are for general informational purposes only and do not constitute investment advice or recommendations. Customers should ensure they fully understand the nature of Contracts for Difference (CFDs), foreign exchange (FX), and crypto derivative products, as well as the risks involved, before engaging in any trading activity.
            </p>
            <p>
              Customers who are unsure about the risks associated with trading CFDs, FX, or crypto derivatives are strongly encouraged to seek independent advice from a qualified financial advisor prior to making any investment decisions.
            </p>
            <p>
              CFDs, FX, and crypto derivatives are complex financial instruments and come with a high risk of losing money rapidly due to leverage. These products may not be suitable for all investors. The value of investments can fluctuate significantly, and customers may lose some or all of their invested capital. By choosing to trade, customers acknowledge and accept full responsibility for any losses or damages incurred as a result of their trading activities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
