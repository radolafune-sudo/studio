"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, Phone, Lock, Mail, UserPlus } from "lucide-react";

export default function Register() {
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
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tight">Create Account</CardTitle>
            <div className="flex flex-col leading-none opacity-80">
              <span className="text-lg font-bold uppercase">Just Markets</span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1">Copy Trading Platform</span>
            </div>
          </CardHeader>
          
          <CardContent className="p-10 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                <div className="relative">
                  <Input required type="email" placeholder="name@example.com" className="h-12 pl-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Country Code</Label>
                  <div className="relative">
                    <Select defaultValue="+1">
                      <SelectTrigger className="h-12 pl-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">+1 (USA)</SelectItem>
                        <SelectItem value="+44">+44 (UK)</SelectItem>
                        <SelectItem value="+234">+234 (NG)</SelectItem>
                        <SelectItem value="+971">+971 (UAE)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                  <div className="relative">
                    <Input required type="tel" placeholder="000 000 000" className="h-12 pl-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Trading Mode</Label>
                <Select defaultValue="copy">
                  <SelectTrigger className="h-12 bg-secondary/30 border-none focus-visible:ring-primary font-bold">
                    <SelectValue placeholder="Select Trading Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copy" className="font-bold">Copy Trading</SelectItem>
                    <SelectItem value="manual" className="font-bold">Manual Trading</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                  <div className="relative">
                    <Input required type="password" placeholder="••••••••" className="h-12 pl-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm Password</Label>
                  <div className="relative">
                    <Input required type="password" placeholder="••••••••" className="h-12 pl-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <Button disabled={loading} type="submit" className="w-full h-14 bg-accent text-white font-black uppercase tracking-widest hover:bg-accent/90 shadow-xl shadow-accent/20 rounded-xl mt-4">
                {loading ? "Creating Account..." : "Register Now"}
              </Button>

              <p className="text-center text-xs text-muted-foreground font-medium pt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-black hover:underline">
                  SIGN IN
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}