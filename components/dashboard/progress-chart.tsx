"use client";
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from "recharts";

interface ProgressChartProps {
  data: { name: string; value: number; fill: string }[];
  title?: string;
}

export function ProgressChart({ data, title }: ProgressChartProps) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-5">
      {title && (
        <h3 className="text-sm font-semibold text-[color:var(--color-ink)] mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <RadialBarChart
          cx="50%" cy="50%" innerRadius="30%" outerRadius="90%"
          data={data}
        >
          <RadialBar
            label={{ position: "insideStart", fill: "#fff", fontSize: 11 }}
            background
            dataKey="value"
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: 12, color: "#4A5773" }}
          />
          <Tooltip
            formatter={(value) => [`${Number(value ?? 0)}%`, "Progress"]}
            contentStyle={{
              borderRadius: 12, border: "1px solid #E4E7EE",
              fontSize: 12, background: "#fff",
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface WeeklyActivityProps {
  data: { day: string; minutes: number }[];
}

export function WeeklyActivityChart({ data }: WeeklyActivityProps) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-5">
      <h3 className="text-sm font-semibold text-[color:var(--color-ink)] mb-4">Weekly Activity</h3>
      <div className="flex items-end gap-1 h-24">
        {data.map((d) => {
          const maxMinutes = Math.max(...data.map((x) => x.minutes), 1);
          const pct = (d.minutes / maxMinutes) * 100;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-[color:var(--color-primary)]/70 transition-all"
                style={{ height: `${pct}%`, minHeight: d.minutes > 0 ? 4 : 0 }}
                title={`${d.minutes} min`}
              />
              <span className="text-[10px] text-[color:var(--color-muted-2)]">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
