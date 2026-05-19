
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  User, 
  Star, 
  ArrowUpRight,
  ShieldAlert,
  Settings2
} from "lucide-react";
import Image from "next/image";

const MOCK_TRADERS = [
  {
    id: 1,
    name: "Alex Sterling",
    strategy: "Price Action Alpha",
    assets: ["Forex", "Stocks"],
    risk: 3,
    return: "+42.5%",
    successRate: "68%",
    followers: 842,
    avatar: "https://picsum.photos/seed/t1/100/100"
  },
  {
    id: 2,
    name: "Elena Vance",
    strategy: "Crypto Momentum",
    assets: ["Crypto", "Defi"],
    risk: 8,
    return: "+112.8%",
    successRate: "54%",
    followers: 1250,
    avatar: "https://picsum.photos/seed/t2/100/100"
  },
  {
    id: 3,
    name: "Marcus Chen",
    strategy: "Macro Swing",
    assets: ["Indices", "Commodities"],
    risk: 4,
    return: "+28.1%",
    successRate: "72%",
    followers: 615,
    avatar: "https://picsum.photos/seed/t3/100/100"
  },
  {
    id: 4,
    name: "Sarah Jenkins",
    strategy: "Dividend Dividend",
    assets: ["Blue Chip Stocks"],
    risk: 2,
    return: "+14.2%",
    successRate: "81%",
    followers: 2100,
    avatar: "https://picsum.photos/seed/t4/100/100"
  },
  {
    id: 5,
    name: "Julian Rosso",
    strategy: "Volatility Arbitrage",
    assets: ["Options", "Futures"],
    risk: 7,
    return: "+65.4%",
    successRate: "59%",
    followers: 432,
    avatar: "https://picsum.photos/seed/t5/100/100"
  },
  {
    id: 6,
    name: "The Quant Fund",
    strategy: "Algorithmic Scaling",
    assets: ["All Markets"],
    risk: 5,
    return: "+38.9%",
    successRate: "64%",
    followers: 1560,
    avatar: "https://picsum.photos/seed/t6/100/100"
  }
];

export default function TraderDiscovery() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Discover Master Traders</h1>
          <p className="text-muted-foreground">Browse top performers and start copying their successful strategies.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10 h-11" placeholder="Search by name, strategy or market..." />
          </div>
          <Button variant="outline" className="flex items-center gap-2 h-11">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="flex items-center gap-2 h-11">
            <Settings2 className="h-4 w-4" />
            Sort By: Return
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TRADERS.map((trader) => (
            <Card key={trader.id} className="group overflow-hidden border-primary/5 hover:border-accent/50 transition-all shadow-sm hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                      <Image 
                        src={trader.avatar} 
                        alt={trader.name} 
                        fill 
                        className="object-cover"
                        data-ai-hint="trader profile"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg leading-none mb-1 group-hover:text-primary transition-colors">
                        {trader.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{trader.strategy}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-secondary/50">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    4.9
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/20 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Total Return</p>
                    <p className="text-xl font-bold text-primary">{trader.return}</p>
                  </div>
                  <div className="bg-secondary/20 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Risk Score</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-bold">{trader.risk}/10</span>
                      {trader.risk > 7 && <ShieldAlert className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {trader.assets.map(asset => (
                    <Badge key={asset} variant="secondary" className="font-normal">{asset}</Badge>
                  ))}
                </div>

                <div className="flex justify-between text-sm pt-2 border-t text-muted-foreground">
                  <span>Success: {trader.successRate}</span>
                  <span>{trader.followers.toLocaleString()} Followers</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-6 flex gap-2">
                <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">Copy Trader</Button>
                <Button variant="outline" size="icon" className="shrink-0">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
