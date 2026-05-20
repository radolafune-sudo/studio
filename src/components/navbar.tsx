
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  X,
  Download,
  Globe
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "TRADING", href: "#" },
    { name: "MARKETS", href: "/traders" },
    { name: "PLATFORMS", href: "#" },
    { name: "EDUCATION", href: "#" },
    { name: "COMPANY", href: "#" },
  ];

  const Logo = () => (
    <div className="flex flex-col items-start leading-none group cursor-pointer">
      <div className="flex items-center gap-1.5">
        <span className="text-[28px] font-black text-primary tracking-tighter uppercase italic">JM</span>
        <span className="text-[24px] font-black text-primary tracking-tighter uppercase">JUST MARKETS</span>
      </div>
      <span className="text-[9px] font-bold text-muted-foreground tracking-[0.3em] uppercase mt-0.5 w-full text-center">
        COPY TRADING PLATFORM
      </span>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-[13px] font-black transition-colors hover:text-primary tracking-widest text-[#555]",
                    pathname === item.href ? "text-primary" : ""
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <Link href="/login" className="text-[13px] font-black text-[#555] hover:text-primary uppercase tracking-widest">
              LOG IN
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-white hover:bg-primary/90 px-10 h-12 rounded-full font-black text-[13px] uppercase tracking-widest shadow-xl shadow-primary/30">
                REGISTER
              </Button>
            </Link>
            <div className="flex items-center gap-4 text-[#555]">
              <Download className="h-5 w-5 cursor-pointer hover:text-primary" />
              <Globe className="h-5 w-5 cursor-pointer hover:text-primary" />
            </div>
          </div>

          <div className="-mr-2 flex lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
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
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black uppercase tracking-widest text-[#555] hover:bg-muted"
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full h-12 font-black uppercase tracking-widest">Log in</Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-12 bg-primary text-white font-black uppercase tracking-widest shadow-lg">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
