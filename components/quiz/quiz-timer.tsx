import { Icon } from "@/components/shared/icon";

interface QuizTimerProps {
  formatted: string;
  isExpired: boolean;
}

export function QuizTimer({ formatted, isExpired }: QuizTimerProps) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 38,
      padding: "0 12px",
      borderRadius: 10,
      background: isExpired ? "rgba(178,58,72,.1)" : "var(--line-2)",
      color: isExpired ? "var(--danger)" : "var(--ink)",
      fontWeight: 700,
      fontSize: 13,
    }}>
      <Icon name="clock" size={15} />
      {formatted}
    </div>
  );
}
