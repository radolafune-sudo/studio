
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
      <section className="relative flex-1 flex items-center justify-center pt-20 pb-32 lg:pt-0 lg:pb-0 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 space-y-10 text-center lg:text-left z-10">
              <div className="space-y-8">
                <h1 className="text-6xl md:text-[84px] font-black text-[#1a1a1a] leading-[1.05] tracking-tight max-w-[600px]">
                  Unlock the Full Power of Your Capital with Elite copy trading
                </h1>
                <p className="text-lg md:text-2xl text-[#22C55E] font-bold leading-relaxed max-w-[550px]">
                  Expand your holdings and move across global markets with confidence, consistency, and proven security
                </p>
              </div>
              
              <div className="pt-4">
                <Link href="/register">
                  <Button className="bg-[#121316] text-white hover:bg-black px-12 h-[72px] rounded-2xl font-black text-xl tracking-tight shadow-2xl transition-transform active:scale-95">
                    Open Account
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex-1 relative w-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[600px] aspect-[4/5]">
                {/* Back Phone */}
                <div className="absolute top-[10%] right-[10%] w-[65%] aspect-[9/18.5] border-[12px] border-black rounded-[50px] overflow-hidden shadow-2xl rotate-[5deg] z-0">
                  <Image 
                    src="https://picsum.photos/seed/lake99/400/800"
                    alt="Scenic Background"
                    fill
                    className="object-cover"
                    data-ai-hint="lake mountain"
                  />
                </div>
                {/* Front Phone */}
                <div className="absolute top-[0%] left-[5%] w-[65%] aspect-[9/18.5] border-[12px] border-black rounded-[50px] overflow-hidden shadow-2xl -rotate-[5deg] z-10">
                  <Image 
                    src="https://picsum.photos/seed/coffee99/400/800"
                    alt="Trading Insight"
                    fill
                    className="object-cover"
                    data-ai-hint="coffee beans"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat Bubble */}
      <div className="fixed bottom-10 right-10 z-50">
        <button className="w-20 h-20 rounded-full bg-[#22C55E] shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
          <MessageCircle className="h-10 w-10 text-white fill-current" />
          <div className="absolute -top-1 -right-1 bg-[#EF4444] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-black border-[3px] border-white shadow-lg">
            1
          </div>
        </button>
      </div>

      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <p className="text-[11px] text-gray-400 max-w-4xl mx-auto leading-relaxed uppercase tracking-widest font-black">
            Risk Warning: Trading financial instruments involves significant risk of loss and is not suitable for all investors. 
            &copy; {new Date().getFullYear()} JUST MARKETS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
