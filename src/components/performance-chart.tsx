
"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { month: "Jan", return: 4.5 },
  { month: "Feb", return: 3.2 },
  { month: "Mar", return: 7.8 },
  { month: "Apr", return: 6.5 },
  { month: "May", return: 12.4 },
  { month: "Jun", return: 15.2 },
  { month: "Jul", return: 14.8 },
  { month: "Aug", return: 18.2 },
  { month: "Sep", return: 22.4 },
  { month: "Oct", return: 20.1 },
  { month: "Nov", return: 25.6 },
  { month: "Dec", return: 31.2 },
];

export function PerformanceChart() {
  return (
    <div className="h-[300px] w-full">
      <ChartContainer
        config={{
          return: {
            label: "Cumulative Return %",
            color: "hsl(var(--primary))",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="return"
              stroke="var(--color-return)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
