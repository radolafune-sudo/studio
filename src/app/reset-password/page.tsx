"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate reset success
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc]">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-md border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-primary p-10 text-primary-foreground text-center space-y-4">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Security Reset</CardTitle>
            <div className="flex flex-col leading-none opacity-80">
              <span className="text-sm font-bold uppercase tracking-widest">Copy Trading Platform</span>
            </div>
          </CardHeader>
          
          <CardContent className="p-10 bg-white">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                  <Input required type="email" placeholder="name@example.com" className="h-12 bg-secondary/30 border-none font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Enter New Password</Label>
                  <div className="relative">
                    <Input required type="password" placeholder="••••••••" className="h-12 pl-10 bg-secondary/30 border-none font-medium" />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</Label>
                  <div className="relative">
                    <Input required type="password" placeholder="••••••••" className="h-12 pl-10 bg-secondary/30 border-none font-medium" />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <Button disabled={loading} type="submit" className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 shadow-xl rounded-xl">
                  {loading ? "Processing..." : "Reset Password"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6 py-4">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Password Updated</h3>
                  <p className="text-sm text-muted-foreground font-medium">Your account security has been refreshed. You can now access the platform.</p>
                </div>
                <Button onClick={() => router.push('/login')} className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest">
                  Sign In Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}