
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Zap, 
  Loader2, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Coins,
  ShieldCheck,
  Plus
} from "lucide-react";
import { recommendTraders, type RecommendTradersOutput } from "@/ai/flows/ai-powered-trader-recommendation";
import { Badge } from "@/components/ui/badge";

export default function AIRecommendations() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendTradersOutput | null>(null);

  const [formData, setFormData] = useState({
    riskTolerance: 'medium' as any,
    investmentGoals: [] as string[],
    preferredAssetClasses: [] as string[]
  });

  const goalsOptions = ["long-term growth", "short-term gains", "income generation", "capital preservation"];
  const assetsOptions = ["stocks", "forex", "cryptocurrency", "commodities", "indices"];

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      investmentGoals: prev.investmentGoals.includes(goal) 
        ? prev.investmentGoals.filter(g => g !== goal)
        : [...prev.investmentGoals, goal]
    }));
  };

  const toggleAsset = (asset: string) => {
    setFormData(prev => ({
      ...prev,
      preferredAssetClasses: prev.preferredAssetClasses.includes(asset) 
        ? prev.preferredAssetClasses.filter(a => a !== asset)
        : [...prev.preferredAssetClasses, asset]
    }));
  };

  async function handleRecommend() {
    if (formData.investmentGoals.length === 0 || formData.preferredAssetClasses.length === 0) {
      alert("Please select at least one goal and one asset class.");
      return;
    }

    setLoading(true);
    try {
      const output = await recommendTraders(formData);
      setResults(output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 py-1 px-3 text-accent border-accent/20 bg-accent/5">
              <Sparkles className="h-3 w-3 mr-2" />
              GenAI Matchmaker
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Trader</h1>
            <p className="text-muted-foreground text-lg">
              Our AI analyzes thousands of data points to find the traders that align with your unique financial DNA.
            </p>
          </div>

          {!results ? (
            <Card className="shadow-lg border-primary/5">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle>Configure Your Profile</CardTitle>
                <CardDescription>Tell us about your trading style and goals.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                {/* Risk Tolerance */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <Label className="text-base font-semibold">What is your Risk Tolerance?</Label>
                  </div>
                  <RadioGroup 
                    defaultValue="medium" 
                    onValueChange={(v) => setFormData(prev => ({...prev, riskTolerance: v as any}))}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-4"
                  >
                    {['low', 'medium', 'high', 'aggressive'].map((level) => (
                      <div key={level} className="relative">
                        <RadioGroupItem value={level} id={level} className="peer sr-only" />
                        <Label
                          htmlFor={level}
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 [&:has([data-state=checked])]:border-accent capitalize cursor-pointer transition-all"
                        >
                          <span className="font-bold">{level}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Goals */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <Label className="text-base font-semibold">What are your Investment Goals?</Label>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {goalsOptions.map(goal => (
                      <div 
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`px-4 py-2 rounded-full border-2 cursor-pointer transition-all text-sm font-medium ${
                          formData.investmentGoals.includes(goal) 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-white text-muted-foreground border-muted hover:border-accent'
                        }`}
                      >
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assets */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="h-5 w-5 text-primary" />
                    <Label className="text-base font-semibold">Preferred Asset Classes</Label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {assetsOptions.map(asset => (
                      <div 
                        key={asset}
                        onClick={() => toggleAsset(asset)}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                          formData.preferredAssetClasses.includes(asset) 
                            ? 'bg-accent/10 text-accent border-accent' 
                            : 'bg-white text-muted-foreground border-muted hover:border-accent'
                        }`}
                      >
                        <Plus className={`h-4 w-4 mb-2 ${formData.preferredAssetClasses.includes(asset) ? 'rotate-45' : ''} transition-transform`} />
                        <span className="capitalize">{asset}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button 
                    onClick={handleRecommend} 
                    className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Traders...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5 fill-current" />
                        Generate AI Recommendations
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Top Matches Found</h2>
                <Button variant="ghost" onClick={() => setResults(null)}>Recalibrate Profile</Button>
              </div>

              {results.traders.map((trader, i) => (
                <Card key={i} className="border-accent/20 overflow-hidden shadow-md">
                  <div className="grid md:grid-cols-3">
                    <div className="p-6 bg-accent/5 flex flex-col justify-center items-center text-center border-r">
                      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                        {trader.name[0]}
                      </div>
                      <h3 className="text-xl font-bold mb-1">{trader.name}</h3>
                      <Badge variant="secondary" className="mb-4">Match Strength: 98%</Badge>
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground uppercase">Returns</p>
                          <p className="font-bold text-primary">{trader.averageAnnualReturn}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground uppercase">Risk</p>
                          <p className="font-bold">{trader.riskScore}/10</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 p-6 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4" />
                          Strategy Summary
                        </h4>
                        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                          {trader.strategySummary}
                        </p>
                        
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                          <h4 className="font-semibold text-primary flex items-center gap-2 mb-2 text-sm">
                            <Sparkles className="h-3.5 w-3.5" />
                            Why our AI chose this trader:
                          </h4>
                          <p className="text-sm text-primary/80 italic">
                            "{trader.reasonForRecommendation}"
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-3">
                        <Button className="flex-1 bg-accent hover:bg-accent/90">Start Copying</Button>
                        <Button variant="outline" className="flex-1">View Full Profile</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
