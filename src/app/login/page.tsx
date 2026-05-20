"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, LogIn } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth success
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc]">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-md border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-primary p-10 text-primary-foreground text-center space-y-4">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tight">Welcome Back</CardTitle>
            <div className="flex flex-col leading-none opacity-80">
              <span className="text-lg font-bold uppercase">Just Markets</span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1">Copy Trading Platform</span>
            </div>
          </CardHeader>
          
          <CardContent className="p-10 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                <div className="relative">
                  <Input required type="email" placeholder="name@example.com" className="h-14 pl-12 bg-secondary/30 border-none focus-visible:ring-primary text-lg font-medium" />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                  <Link href="/reset-password" title="Enter new password" data-ai-hint="reset password" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input required type="password" placeholder="••••••••" className="h-14 pl-12 bg-secondary/30 border-none focus-visible:ring-primary text-lg font-medium" />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <Button disabled={loading} type="submit" className="w-full h-16 bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl mt-4">
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-xs text-muted-foreground font-medium pt-4">
                Don't have an account?{" "}
                <Link href="/register" className="text-accent font-black hover:underline">
                  REGISTER NOW
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}