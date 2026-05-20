"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  LayoutDashboard, 
  Search,
  Menu,
  X,
  User
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Discover", href: "/traders", icon: Search },
    { name: "AI Match", href: "/recommendations", icon: Zap },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  const Logo = () => (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-xl font-black text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
        JM
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black text-primary tracking-tighter uppercase">Just Markets</span>
        <span className="text-[7px] font-black text-muted-foreground tracking-[0.2em] uppercase">Copy Trading Platform</span>
      </div>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm font-bold transition-colors hover:text-primary uppercase tracking-wider",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-bold text-sm uppercase tracking-widest">Log in</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-accent text-white hover:bg-accent/90 px-6 font-black uppercase tracking-widest shadow-lg shadow-accent/20">Get Started</Button>
            </Link>
          </div>

          <div className="-mr-2 flex md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-1 pb-3 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-bold uppercase tracking-widest",
                  pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full h-12 font-bold uppercase tracking-widest">Log in</Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-12 bg-accent text-white font-bold uppercase tracking-widest shadow-lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}