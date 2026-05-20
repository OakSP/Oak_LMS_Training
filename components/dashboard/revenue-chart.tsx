"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
  title?: string;
}

export function RevenueChart({ data, title }: RevenueChartProps) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-5">
      {title && (
        <h3 className="text-sm font-semibold text-[color:var(--color-ink)] mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B8763A" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#B8763A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EE" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7B8699" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#7B8699" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value) => [`฿${Number(value ?? 0).toLocaleString()}`, "Revenue"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #E4E7EE", fontSize: 12 }}
          />
          <Area
            type="monotone" dataKey="revenue"
            stroke="#B8763A" strokeWidth={2}
            fill="url(#revenueGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
