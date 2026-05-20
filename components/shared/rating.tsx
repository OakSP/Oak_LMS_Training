import { Icon } from "./icon";

interface RatingProps {
  value: number;
  size?: number;
  showNumber?: boolean;
}

export function Rating({ value, size = 13, showNumber = true }: RatingProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ display: "inline-flex", color: "var(--accent)" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Icon key={i} name="star" size={size} style={{ opacity: i < Math.round(value) ? 1 : 0.22 }} />
        ))}
      </span>
      {showNumber && (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>
          {value.toFixed(1)}
        </span>
      )}
    </span>
  );
}
