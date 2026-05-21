
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
    const initialCandles: Candle[] = Array.from({ length: 30 }, () => {
      const o = 30 + Math.random() * 40;
      const isUp = Math.random() > 0.4;
      const c = isUp ? o + Math.random() * 10 : o - Math.random() * 10;
      return {
        o,
        c,
        h: Math.max(o, c) + Math.random() * 5,
        l: Math.min(o, c) - Math.random() * 5,
        color: isUp ? "#22C55E" : "#EF4444",
      };
    });
    setCandles(initialCandles);

    const interval = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        const nextO = last.c;
        const isUp = Math.random() > 0.35; // 65% chance of green
        const change = Math.random() * 8;
        const nextC = isUp ? nextO + change : nextO - change;
        
        const boundedC = Math.max(15, Math.min(85, nextC));

        const newCandle: Candle = {
          o: nextO,
          c: boundedC,
          h: Math.max(nextO, boundedC) + Math.random() * 4,
          l: Math.min(nextO, boundedC) - Math.random() * 4,
          color: isUp ? "#22C55E" : "#EF4444",
        };

        return [...prev.slice(1), newCandle];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-end gap-1 p-6 bg-white rounded-[3rem] border border-gray-100 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      
      {/* Dynamic Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-[0.03] py-8 px-4 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-full h-px bg-black" />
        ))}
      </div>

      {candles.map((candle, i) => {
        const bodyHeight = Math.max(1, Math.abs(candle.c - candle.o));
        const bodyBottom = Math.min(candle.o, candle.c);
        const wickHeight = Math.max(bodyHeight + 2, candle.h - candle.l);
        const wickBottom = candle.l;

        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative transition-all duration-1000 ease-in-out">
            <div 
              className="w-[1.5px] absolute z-0 rounded-full opacity-40" 
              style={{ 
                height: `${wickHeight}%`, 
                bottom: `${wickBottom}%`,
                backgroundColor: candle.color
              }} 
            />
            <div 
              className="w-full rounded-[1px] z-10" 
              style={{ 
                height: `${bodyHeight}%`, 
                bottom: `${bodyBottom}%`,
                backgroundColor: candle.color,
                boxShadow: `0 0 8px ${candle.color}22`
              }} 
            />
          </div>
        );
      })}
    </div>
  );
}
