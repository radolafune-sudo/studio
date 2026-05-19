
"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Wallet, 
  Activity, 
  History,
  MoreVertical,
  Plus
} from "lucide-react";
import { PerformanceChart } from "@/components/performance-chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Dashboard() {
  const activeCopies = [
    { name: "Alex Sterling", strategy: "Forex Alpha", allocated: "$5,000", profit: "+$420.50", status: "Active" },
    { name: "Elena Vance", strategy: "Crypto Mo", allocated: "$2,000", profit: "-$84.10", status: "Active" },
    { name: "Sarah Jenkins", strategy: "Dividends", allocated: "$10,000", profit: "+$120.00", status: "Paused" },
  ];

  const recentTrades = [
    { symbol: "EUR/USD", type: "BUY", price: "1.0842", time: "10:24 AM", result: "+$12.50", trader: "Alex Sterling" },
    { symbol: "BTC/USDT", type: "SELL", price: "64,210.50", time: "09:15 AM", result: "-$4.20", trader: "Elena Vance" },
    { symbol: "AAPL", type: "BUY", price: "182.10", time: "Yesterday", result: "+$45.00", trader: "Sarah Jenkins" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Account Overview</h1>
            <p className="text-muted-foreground text-sm">Welcome back, John Doe. Here is your portfolio status.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white">Add Funds</Button>
            <Button size="sm" className="bg-primary">Withdraw</Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Wallet className="h-5 w-5" />
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">+12.4%</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Equity</p>
              <h3 className="text-2xl font-bold">$24,582.40</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <Activity className="h-5 w-5" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">3 Masters</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Copying Traders</p>
              <h3 className="text-2xl font-bold">$17,000.00</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Profit</p>
              <h3 className="text-2xl font-bold text-green-600">+$456.40</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
                  <History className="h-5 w-5" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
              <h3 className="text-2xl font-bold">68.5%</h3>
              <Progress value={68.5} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Portfolio Growth</CardTitle>
                  <CardDescription>Visualizing your wealth journey over time</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8">1W</Button>
                  <Button variant="ghost" size="sm" className="h-8 bg-primary/10 text-primary">1M</Button>
                  <Button variant="ghost" size="sm" className="h-8">ALL</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>

          {/* Active Copies */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Master Traders</CardTitle>
                <CardDescription>Strategies you are currently following</CardDescription>
              </div>
              <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCopies.map((copy, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-primary">
                      {copy.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{copy.name}</p>
                      <p className="text-xs text-muted-foreground">{copy.strategy}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${copy.profit.startsWith('+') ? 'text-green-600' : 'text-destructive'}`}>
                      {copy.profit}
                    </p>
                    <Badge variant={copy.status === 'Active' ? 'default' : 'secondary'} className="text-[10px] h-4">
                      {copy.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs h-9">View All Connections</Button>
            </CardContent>
          </Card>

          {/* Recent Trades Table */}
          <Card className="lg:col-span-3 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Real-time Execution History</CardTitle>
              <CardDescription>Last executed trades replicated across your accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Replicated From</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Net P/L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTrades.map((trade, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{trade.symbol}</TableCell>
                      <TableCell>
                        <Badge variant={trade.type === 'BUY' ? 'secondary' : 'outline'} className={trade.type === 'BUY' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                          {trade.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{trade.price}</TableCell>
                      <TableCell className="text-muted-foreground">{trade.trader}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{trade.time}</TableCell>
                      <TableCell className={`text-right font-bold ${trade.result.startsWith('+') ? 'text-green-600' : 'text-destructive'}`}>
                        {trade.result}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
