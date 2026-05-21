
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Candle {
  o: number;
  c: number;
  h: number;
  l: number;
  color: string;
}

export function LiveChart() {
  const [candles, setCandles] = useState<Candle[]>([]);

  useEffect(() => {
    // Initial data generation
    const initialCandles: Candle[] = Array.from({ length: 24 }, () => {
      const o = 30 + Math.random() * 40;
      const isUp = Math.random() > 0.4;
      const c = isUp ? o + Math.random() * 15 : o - Math.random() * 15;
      return {
        o,
        c,
        h: Math.max(o, c) + Math.random() * 10,
        l: Math.min(o, c) - Math.random() * 10,
        color: isUp ? "#22C55E" : "#EF4444",
      };
    });
    setCandles(initialCandles);

    const interval = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        const nextO = last.c;
        const isUp = Math.random() > 0.35; // 65% chance of green as requested
        const change = Math.random() * 12;
        const nextC = isUp ? nextO + change : nextO - change;
        
        // Keep it within a visible vertical range
        const boundedC = Math.max(10, Math.min(90, nextC));

        const newCandle: Candle = {
          o: nextO,
          c: boundedC,
          h: Math.max(nextO, boundedC) + Math.random() * 5,
          l: Math.min(nextO, boundedC) - Math.random() * 5,
          color: isUp ? "#22C55E" : "#EF4444",
        };

        return [...prev.slice(1), newCandle];
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-end gap-1.5 p-8 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      
      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-10 py-8 px-4 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-full h-px bg-white" />
        ))}
      </div>

      {candles.map((candle, i) => {
        const bodyHeight = Math.max(2, Math.abs(candle.c - candle.o));
        const bodyBottom = Math.min(candle.o, candle.c);
        const wickHeight = candle.h - candle.l;
        const wickBottom = candle.l;

        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative transition-all duration-700 ease-in-out">
            {/* Wick */}
            <div 
              className="w-[2px] absolute z-0 rounded-full opacity-60" 
              style={{ 
                height: `${wickHeight}%`, 
                bottom: `${wickBottom}%`,
                backgroundColor: candle.color
              }} 
            />
            {/* Body */}
            <div 
              className="w-full rounded-[2px] z-10 shadow-lg" 
              style={{ 
                height: `${bodyHeight}%`, 
                bottom: `${bodyBottom}%`,
                backgroundColor: candle.color,
                boxShadow: `0 0 15px ${candle.color}33`
              }} 
            />
          </div>
        );
      })}
    </div>
  );
}
