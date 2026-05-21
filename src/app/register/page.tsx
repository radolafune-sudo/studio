
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, UserPlus, Eye, EyeOff, Globe, Phone } from "lucide-react";
import { registerUser, updateUserProfile } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    countryCode: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await registerUser(formData.email, formData.password);
      
      // Create user profile in local simulated layer or Firestore
      await updateUserProfile(user.uid, {
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        balance: 0,
        role: "user",
        countryCode: formData.countryCode,
        phone: formData.phone,
        createdAt: new Date().toISOString()
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Could not create account.",
      });
    } finally {
      setLoading(false);
    }
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
              <div className="flex items-center justify-center gap-1">
                <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center text-primary font-black text-[8px]">JM</div>
                <span className="text-lg font-bold uppercase">Just Markets</span>
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1">Copy Trading Platform</span>
            </div>
          </CardHeader>
          
          <CardContent className="p-10 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                <div className="relative">
                  <Input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@example.com" 
                    className="h-12 pl-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" 
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Country Code</Label>
                  <div className="relative">
                    <Input 
                      required 
                      type="text" 
                      value={formData.countryCode}
                      onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                      placeholder="+1" 
                      className="h-12 pl-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" 
                    />
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                  <div className="relative">
                    <Input 
                      required 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="000 000 000" 
                      className="h-12 pl-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" 
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                <div className="relative">
                  <Input 
                    required 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••" 
                    className="h-12 pl-10 pr-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" 
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
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
