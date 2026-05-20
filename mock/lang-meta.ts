import type { LangMeta, CourseLang } from "@/types/course";

export const LANG_META: Record<CourseLang, LangMeta> = {
  en: {
    code: "EN",
    th: "อังกฤษ",
    en: "English",
    glyph: "A",
    glyphLong: "Aa",
    color: "var(--en)",
    swatch: "linear-gradient(135deg,#3A5EB8 0%,#1A3461 100%)",
  },
  zh: {
    code: "ZH",
    th: "จีน",
    en: "Chinese",
    glyph: "中",
    glyphLong: "汉",
    color: "var(--zh)",
    swatch: "linear-gradient(135deg,#B23A48 0%,#7A1F2A 100%)",
    scriptClass: "ch-zh",
  },
  ja: {
    code: "JA",
    th: "ญี่ปุ่น",
    en: "Japanese",
    glyph: "あ",
    glyphLong: "日",
    color: "var(--jp)",
    swatch: "linear-gradient(135deg,#7A4FB8 0%,#3F2A6A 100%)",
    scriptClass: "ch-jp",
  },
};
