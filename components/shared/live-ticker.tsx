"use client";
import { useLang } from "@/hooks/use-lang";
import { TICKER } from "@/mock/ticker";

export function LiveTicker() {
  const { lang, t } = useLang();
  const items = [...TICKER, ...TICKER];

  return (
    <div style={{
      background: "var(--bg-2)",
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)",
      padding: "11px 0",
      overflow: "hidden",
      position: "relative",
    }}>
      <div style={{
        maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
        WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
      }}>
        <div style={{
          display: "flex",
          gap: 48,
          width: "max-content",
          animation: "ticker 38s linear infinite",
        }}>
          {items.map((item, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: 99,
                background: "var(--success)", flexShrink: 0,
              }} />
              <span style={{ color: "var(--accent)", fontWeight: 600, fontSize: 11, letterSpacing: ".08em" }}>
                {t("live")}
              </span>
              {item[lang]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
