import { LANG_META } from "@/mock/lang-meta";
import type { Course } from "@/types/course";

interface CourseThumbProps {
  course: Course;
  size?: "sm" | "md" | "lg";
  titleOverride?: string;
}

export function CourseThumb({ course, size = "md", titleOverride }: CourseThumbProps) {
  const m = LANG_META[course.lang];
  const h = size === "lg" ? 240 : size === "sm" ? 130 : 168;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: h,
      borderRadius: 12,
      overflow: "hidden",
      background: m.swatch,
      color: "rgba(255,255,255,.95)",
      isolation: "isolate",
    }}>
      {/* Oversized decorative glyph */}
      <div className={m.scriptClass ?? ""} style={{
        position: "absolute",
        right: -16, bottom: -32,
        fontSize: size === "lg" ? 360 : 240,
        fontWeight: 700,
        lineHeight: 0.8,
        color: "rgba(255,255,255,.12)",
        pointerEvents: "none",
        userSelect: "none",
        letterSpacing: "-0.02em",
      }}>{m.glyphLong}</div>

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
        backgroundSize: "32px 32px",
        maskImage: "radial-gradient(ellipse at top left,#000 30%,transparent 80%)",
      }} />

      {/* Foreground content */}
      <div style={{ position: "relative", padding: 18, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em",
            padding: "4px 9px", borderRadius: 4,
            background: "rgba(255,255,255,.18)", backdropFilter: "blur(6px)",
          }}>{m.code} · {course.level}</span>
          {course.badge === "bestseller" && (
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", padding: "4px 9px", borderRadius: 4, background: "var(--accent)", color: "#1a0f00" }}>
              BESTSELLER
            </span>
          )}
          {course.badge === "new" && (
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", padding: "4px 9px", borderRadius: 4, background: "#fff", color: "#222" }}>
              NEW
            </span>
          )}
        </div>
        <div style={{
          fontSize: size === "lg" ? 26 : 18,
          fontWeight: 600, letterSpacing: "-.01em",
          lineHeight: 1.2,
          textShadow: "0 2px 16px rgba(0,0,0,.25)",
          maxWidth: "75%",
        }}>{titleOverride}</div>
      </div>
    </div>
  );
}
