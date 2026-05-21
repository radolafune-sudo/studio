
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  X,
  Download,
  Globe,
  LogOut,
  Settings,
  ChevronDown,
  ShieldAlert
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser, useAuth, useFirestore, useDoc } from "@/firebase";
import { signOut } from "firebase/auth";
import { doc } from "firebase/firestore";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const [isOpen, setIsOpen] = useState(false);

  const userRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);
  
  const { data: userProfile } = useDoc(userRef);

  const isAuthenticated = !!user;

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  const navItems = [
    { name: "TRADING", href: isAuthenticated ? "/dashboard" : "/login" },
    { name: "MARKETS", href: "/traders" },
    { name: "COMPANY", href: "#" },
  ];

  const Logo = () => (
    <div className="flex flex-col items-start leading-none group cursor-pointer">
      <div className="flex items-center gap-2">
        <div className="bg-primary w-8 h-8 rounded-md flex items-center justify-center text-white font-black text-sm shadow-sm">
          JM
        </div>
        <div className="flex flex-col">
          <span className="text-[20px] font-black text-black tracking-tighter uppercase leading-[0.9]">JUST MARKETS</span>
          <span className="text-[7px] font-bold text-muted-foreground tracking-[0.3em] uppercase w-full text-center mt-0.5">
            COPY TRADING PLATFORM
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-12">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-[13px] font-black transition-colors hover:text-primary tracking-[0.2em] text-black uppercase",
                    pathname === item.href ? "text-primary" : ""
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="text-[13px] font-black text-black hover:text-primary uppercase tracking-widest">
                  LOG IN
                </Link>
                <Link href="/register">
                  <Button className="bg-primary text-white hover:bg-primary/90 px-10 h-11 rounded-full font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/30">
                    REGISTER
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 cursor-pointer p-2 hover:bg-muted/50 rounded-xl transition-all">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary text-white font-black text-xs uppercase">
                          {userProfile?.name?.slice(0, 2) || "JD"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start leading-none">
                        <span className="text-sm font-black text-black uppercase tracking-tight">{userProfile?.name || "User"}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ID: {user?.uid?.slice(0, 8).toUpperCase() || "..."}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Account Details</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userProfile?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="py-3 rounded-lg font-bold text-sm cursor-pointer text-primary">
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="py-3 rounded-lg font-bold text-sm cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="py-3 rounded-lg font-bold text-sm cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <div className="flex items-center gap-4 text-black/70">
              <Download className="h-5 w-5 cursor-pointer hover:text-primary" />
              <Globe className="h-5 w-5 cursor-pointer hover:text-primary" />
            </div>
          </div>

          <div className="-mr-2 flex lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-black">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t bg-white p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-1 pb-3 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black uppercase tracking-widest text-black hover:bg-muted/50"
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              {!isAuthenticated ? (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-12 font-black uppercase tracking-widest text-black border-black/10">Log in</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-12 bg-primary text-white font-black uppercase tracking-widest shadow-lg">Register</Button>
                  </Link>
                </>
              ) : (
                <div className="flex flex-col gap-2 p-2 bg-muted/20 rounded-xl">
                  <p className="text-[10px] font-black uppercase text-center text-muted-foreground py-2">ID: {user?.uid?.slice(0, 8).toUpperCase()}</p>
                  {userProfile?.role === 'admin' && (
                    <Link href="/admin" className="w-full" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start font-bold uppercase tracking-widest text-primary">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" className="w-full justify-start font-bold uppercase tracking-widest text-black">Settings</Button>
                  <Button onClick={handleLogout} variant="destructive" className="w-full font-bold uppercase tracking-widest">Log Out</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
