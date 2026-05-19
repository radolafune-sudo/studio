
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  Users, 
  Globe, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PerformanceChart } from "@/components/performance-chart";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge variant="outline" className="mb-4 py-1 px-3 text-primary border-primary/20 bg-primary/5">
                <Zap className="h-3 w-3 mr-2" />
                AI-Powered Social Trading
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-[1.1]">
                Master the Markets by <span className="text-primary">Copying Experts</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Connect with professional traders, replicate their strategies automatically, and grow your portfolio with transparency and ease. Powered by JUST MARKETS.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/traders">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12">
                    Explore Traders
                  </Button>
                </Link>
                <Link href="/recommendations">
                  <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 px-8 h-12">
                    Try AI Recommendation
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Verified Trades
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4 text-accent" />
                  Real-time Execution
                </div>
              </div>
            </div>
            <div className="flex-1 w-full max-w-xl lg:max-w-none">
              <Card className="shadow-2xl border-primary/10 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                <CardContent className="p-0">
                  <div className="p-6 bg-primary text-primary-foreground flex justify-between items-center">
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-70">Top Performance</p>
                      <h3 className="text-xl font-bold">Strategy: Alpha Growth</h3>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">+32.4% YTD</Badge>
                  </div>
                  <div className="p-6 bg-white">
                    <PerformanceChart />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose JUST MARKETS?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the tools and transparency you need to succeed in the financial markets through community wisdom.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Follow Top Traders",
                desc: "Browse hundreds of verified master traders and see their real history before you copy."
              },
              {
                icon: Zap,
                title: "Instant Replication",
                desc: "Our high-speed engine copies trades across accounts in milliseconds, minimizing slippage."
              },
              {
                icon: ShieldCheck,
                title: "Full Control",
                desc: "Set your own stop-losses, allocation limits, and pause copying at any moment with one click."
              }
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">$2B+</p>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">AUM Copied</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">50K+</p>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">Active Followers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">1.2K</p>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">Master Traders</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">15ms</p>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">Avg. Execution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-8 w-8 text-accent" />
                <span className="text-2xl font-bold tracking-tighter">JUST MARKETS</span>
              </Link>
              <p className="text-primary-foreground/70 max-w-sm mb-6">
                The world's most trusted copy trading platform. Empowering followers through expert-led strategies and real-time execution.
              </p>
              <div className="flex gap-4">
                <Globe className="h-5 w-5 opacity-70 hover:opacity-100 cursor-pointer" />
                <Users className="h-5 w-5 opacity-70 hover:opacity-100 cursor-pointer" />
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-primary-foreground/70">
                <li><Link href="/traders" className="hover:text-accent transition-colors">Find Traders</Link></li>
                <li><Link href="/recommendations" className="hover:text-accent transition-colors">AI Matchmaker</Link></li>
                <li><Link href="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-primary-foreground/70">
                <li><Link href="#" className="hover:text-accent transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
            <p>&copy; {new Date().getFullYear()} JUST MARKETS. All rights reserved. High-risk investment notice: Trading carries significant risk.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
