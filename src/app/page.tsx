
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Activity, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { LiveChart } from "@/components/live-chart";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <Navbar />
      
      <section className="relative flex-1 flex items-center justify-center pt-12 pb-24 lg:pt-0 lg:pb-0 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-8 text-center lg:text-left z-10">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-[76px] font-black text-[#1a1a1a] leading-[1.05] tracking-tight">
                  Unlock the Full Power of Your Capital with Elite Market Conditions
                </h1>
                <p className="text-lg md:text-xl text-primary font-bold leading-relaxed max-w-[650px] mx-auto lg:mx-0">
                  Expand your holdings and move across global markets with confidence, consistency, and proven security
                </p>
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <Button className="w-full sm:w-auto bg-[#121316] text-white hover:bg-black px-12 h-[68px] rounded-xl font-black text-xl tracking-tight shadow-2xl transition-transform active:scale-95">
                    Open Account
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8 opacity-60">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Real-time execution</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Secured by JM Protocol</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full flex flex-col items-center lg:items-end mt-12 lg:mt-0 min-h-[500px]">
              <div className="relative w-full max-w-[600px] h-[500px]">
                <LiveChart />
              </div>
              <div className="mt-6 text-center lg:text-right max-w-[400px]">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                  Advanced wave analysis powered by JM algorithmic core. Green candles indicate positive market sentiment and bullish breakouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
        <button className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
          <MessageCircle className="h-8 w-8 md:h-10 md:w-10 text-white fill-current" />
        </button>
      </div>

      <footer className="bg-white border-t border-gray-100 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary w-6 h-6 rounded flex items-center justify-center text-white font-black text-[10px]">JM</div>
            <span className="font-black uppercase tracking-tighter text-black">JUST MARKETS</span>
          </div>
          <p className="text-[10px] text-gray-400 max-w-4xl mx-auto leading-relaxed uppercase tracking-widest font-black">
            &copy; {new Date().getFullYear()} JUST MARKETS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
