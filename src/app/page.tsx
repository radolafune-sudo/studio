import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <Navbar />
      
      {/* Hero Section */}
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
            </div>

            <div className="flex-1 relative w-full flex justify-center lg:justify-end mt-12 lg:mt-0">
              <div className="relative w-full max-w-[550px] aspect-[1/1]">
                {/* Back Phone - Strategy/Summary */}
                <div className="absolute top-[5%] right-[15%] w-[55%] aspect-[9/19] border-[12px] border-[#1a1a1a] rounded-[50px] overflow-hidden shadow-2xl rotate-[2deg] z-0 bg-[#F1F3F9]">
                  <Image 
                    src="https://picsum.photos/seed/jm-strategy/400/800"
                    alt="Ready to start banner"
                    fill
                    className="object-cover"
                    data-ai-hint="trading banner"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#E7F6ED] to-transparent p-6">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                      <p className="text-sm font-black text-[#1A2E24] leading-tight">Ready to start today with a proven strategy?</p>
                      <button className="mt-2 text-[10px] font-black uppercase text-[#22C55E]">Copy Trade Now</button>
                    </div>
                  </div>
                </div>
                {/* Front Phone - Main Chart */}
                <div className="absolute top-[0%] left-[10%] w-[58%] aspect-[9/19] border-[12px] border-[#1a1a1a] rounded-[50px] overflow-hidden shadow-2xl -rotate-[3deg] z-10 bg-white">
                  <Image 
                    src="https://picsum.photos/seed/jm-chart-live/400/800"
                    alt="Forex Live Chart"
                    fill
                    className="object-cover"
                    data-ai-hint="forex graph"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat Bubble */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
        <button className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#22C55E] shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
          <MessageCircle className="h-8 w-8 md:h-10 md:w-10 text-white fill-current" />
          <div className="absolute -top-1 -right-1 bg-[#EF4444] text-white w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs md:text-sm font-black border-[3px] border-white shadow-lg">
            1
          </div>
        </button>
      </div>

      <footer className="bg-white border-t border-gray-100 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary w-6 h-6 rounded flex items-center justify-center text-white font-black text-[10px]">JM</div>
            <span className="font-black uppercase tracking-tighter text-black">JUST MARKETS</span>
          </div>
          <p className="text-[10px] text-gray-400 max-w-4xl mx-auto leading-relaxed uppercase tracking-widest font-black">
            Risk Warning: Trading financial instruments involves significant risk of loss and is not suitable for all investors. 
            &copy; {new Date().getFullYear()} JUST MARKETS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
