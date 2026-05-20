import { LANG_META } from "@/mock/lang-meta";
import type { CourseLang } from "@/types/course";

interface LangGlyphProps {
  lang: CourseLang;
  big?: boolean;
}

export function LangGlyph({ lang, big = false }: LangGlyphProps) {
  const m = LANG_META[lang];
  return (
    <span className={m.scriptClass ?? ""} style={{
      fontSize: big ? 120 : 28,
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: "-0.02em",
      color: "currentColor",
    }}>
      {big ? m.glyphLong : m.glyph}
    </span>
  );
}
