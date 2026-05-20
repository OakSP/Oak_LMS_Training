interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon?: string;
  trend?: { value: number; label: string };
  accent?: boolean;
}

export function StatCard({ title, value, sub, icon, trend, accent }: StatCardProps) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-[color:var(--color-accent)]/30 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-2)] text-white" : "border-[color:var(--color-line)] bg-[color:var(--color-card)]"}`}>
      <div className="flex items-start justify-between mb-3">
        <p className={`text-sm font-medium ${accent ? "text-white/70" : "text-[color:var(--color-muted)]"}`}>
          {title}
        </p>
        {icon && (
          <span className={`h-9 w-9 rounded-xl flex items-center justify-center text-lg ${accent ? "bg-white/10" : "bg-[color:var(--color-line-2)]"}`}>
            {icon}
          </span>
        )}
      </div>

      <p className={`text-3xl font-bold tracking-tight ${accent ? "text-white" : "text-[color:var(--color-ink)]"}`}>
        {value}
      </p>

      {sub && (
        <p className={`mt-1 text-xs ${accent ? "text-white/60" : "text-[color:var(--color-muted)]"}`}>
          {sub}
        </p>
      )}

      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span className={`text-xs font-medium ${trend.value >= 0 ? "text-[color:var(--color-success)]" : "text-[color:var(--color-danger)]"}`}>
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className={`text-xs ${accent ? "text-white/50" : "text-[color:var(--color-muted-2)]"}`}>
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
