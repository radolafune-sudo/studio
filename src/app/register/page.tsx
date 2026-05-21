"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, UserPlus, Eye, EyeOff, Globe, Phone, User } from "lucide-react";
import { registerUser, updateUserProfile } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    countryCode: "254", // Numbers only, default to 254 or empty
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Mismatch",
        description: "Your passwords do not match. Please try again.",
      });
      return;
    }

    setLoading(true);
    try {
      const { user } = await registerUser(formData.email, formData.password);
      
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      await updateUserProfile(user.uid, {
        email: formData.email,
        name: fullName || formData.email.split('@')[0],
        firstName: formData.firstName,
        lastName: formData.lastName,
        balance: 0,
        role: "user",
        countryCode: `+${formData.countryCode}`,
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
          <CardHeader className="bg-primary p-8 text-primary-foreground text-center space-y-4">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Create Account</CardTitle>
            <div className="flex flex-col leading-none opacity-80">
              <div className="flex items-center justify-center gap-1">
                <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center text-primary font-black text-[8px]">JM</div>
                <span className="text-lg font-bold uppercase tracking-tighter">Just Markets</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">First Name</Label>
                  <div className="relative">
                    <Input 
                      required 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="John" 
                      className="h-11 pl-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" 
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Last Name</Label>
                  <div className="relative">
                    <Input 
                      required 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Doe" 
                      className="h-11 pl-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" 
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                <div className="relative">
                  <Input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@example.com" 
                    className="h-11 pl-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" 
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Code</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 flex items-center gap-1 z-10">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-black text-muted-foreground">+</span>
                    </div>
                    <Input 
                      required 
                      type="text" 
                      value={formData.countryCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setFormData({...formData, countryCode: val});
                      }}
                      placeholder="254" 
                      className="h-11 pl-12 bg-secondary/30 border-none focus-visible:ring-primary font-medium" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                  <div className="relative">
                    <Input 
                      required 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="700 000 000" 
                      className="h-11 pl-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" 
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                <div className="relative">
                  <Input 
                    required 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••" 
                    className="h-11 pl-10 pr-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" 
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

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    required 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••" 
                    className="h-11 pl-10 pr-10 bg-secondary/30 border-none focus-visible:ring-primary font-medium" 
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button disabled={loading} type="submit" className="w-full h-14 bg-accent text-white font-black uppercase tracking-widest hover:bg-accent/90 shadow-xl shadow-accent/20 rounded-xl mt-4">
                {loading ? "Creating Account..." : "Register Now"}
              </Button>

              <p className="text-center text-xs text-muted-foreground font-medium pt-2">
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
