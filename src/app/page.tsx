import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight,
  TrendingUp,
  Globe,
  Users,
  MessageCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-white">
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black text-[#1a1a1a] leading-[1.05] tracking-tight">
                  Better than <br />
                  <span className="text-primary italic">copy trading</span>
                </h1>
                <p className="text-xl md:text-2xl text-accent font-extrabold uppercase tracking-tight">
                  Join the platform used by millions
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link href="/register">
                  <Button size="lg" className="bg-accent text-white hover:bg-accent/90 px-12 h-16 rounded-full font-black text-xl uppercase tracking-widest shadow-xl shadow-accent/20">
                    Open Account
                  </Button>
                </Link>
                <Link href="/traders">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 px-12 h-16 rounded-full font-black text-xl uppercase tracking-widest">
                    Try Demo
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 opacity-60">
                <div className="text-center">
                  <p className="text-2xl font-black">2M+</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Users</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-black">150+</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Countries</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-black">0.0</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Pips</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-2xl">
              <div className="relative aspect-square w-full">
                <Image 
                  src="https://picsum.photos/seed/jmhero/800/800"
                  alt="Trading App"
                  fill
                  className="object-contain"
                  data-ai-hint="trading app"
                  priority
                />
              </div>
              {/* Floating badges */}
              <div className="absolute top-1/4 -left-8 bg-white p-4 rounded-2xl shadow-2xl animate-bounce duration-1000">
                <TrendingUp className="text-primary h-8 w-8" />
              </div>
              <div className="absolute bottom-1/4 -right-8 bg-white p-4 rounded-2xl shadow-2xl animate-pulse">
                <ShieldCheck className="text-accent h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat Bubble */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative group">
          <Button className="w-16 h-16 rounded-full bg-primary shadow-2xl hover:scale-110 transition-transform">
            <MessageCircle className="h-8 w-8 text-white" />
          </Button>
          <div className="absolute -top-1 -right-1 bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
            1
          </div>
        </div>
      </div>

      <footer className="bg-[#1a1a1a] text-white py-20 mt-auto">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="flex items-center justify-center gap-2">
            <div className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-lg font-black">JM</div>
            <span className="text-xl font-black uppercase tracking-tighter">Just Markets</span>
          </div>
          <p className="text-sm text-gray-500 max-w-4xl mx-auto leading-relaxed">
            Risk Warning: Trading financial instruments involves significant risk of loss and is not suitable for all investors. 
            Ensure you fully understand the risks involved and take appropriate care to manage your risk.
            &copy; {new Date().getFullYear()} JUST MARKETS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}