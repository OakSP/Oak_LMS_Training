interface LessonProgressBarProps {
  percent: number;
  label?: string;
}

export function LessonProgressBar({ percent, label }: LessonProgressBarProps) {
  const safePercent = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, color: "var(--muted)" }}>
        <span>{label ?? "Progress"}</span>
        <strong style={{ color: "var(--ink)" }}>{safePercent}%</strong>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: "var(--line-2)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${safePercent}%`,
            borderRadius: 99,
            background: "linear-gradient(90deg,var(--accent),var(--success))",
            transition: "width .25s ease",
          }}
        />
      </div>
    </div>
  );
}
