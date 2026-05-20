"use client";
import { useLang } from "@/hooks/use-lang";
import { LANG_META } from "@/mock/lang-meta";
import type { CourseLang } from "@/types/course";

type LangFilter = "all" | CourseLang;
type SortOption = "pop" | "new" | "rating";

interface CourseFiltersProps {
  activeLang: LangFilter;
  sort: SortOption;
  onLangChange: (l: LangFilter) => void;
  onSortChange: (s: SortOption) => void;
}

export function CourseFilters({ activeLang, sort, onLangChange, onSortChange }: CourseFiltersProps) {
  const { lang, t } = useLang();

  const langOpts: { key: LangFilter; label: string }[] = [
    { key: "all", label: t("flt_all") },
    { key: "en", label: lang === "en" ? LANG_META.en.en : LANG_META.en.th },
    { key: "zh", label: lang === "en" ? LANG_META.zh.en : LANG_META.zh.th },
    { key: "ja", label: lang === "en" ? LANG_META.ja.en : LANG_META.ja.th },
  ];

  const sortOpts: { key: SortOption; label: string }[] = [
    { key: "pop",    label: t("flt_pop") },
    { key: "rating", label: t("flt_rating") },
    { key: "new",    label: t("flt_new") },
  ];

  const chipBase: React.CSSProperties = {
    padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500,
    border: "1px solid var(--line)", cursor: "pointer", transition: "all .15s ease",
    background: "var(--card)", color: "var(--muted)",
  };
  const chipActive: React.CSSProperties = {
    ...chipBase, background: "var(--ink)", color: "#fff", borderColor: "var(--ink)",
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 32 }}>
      {/* Lang filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {langOpts.map((o) => (
          <button key={o.key} style={activeLang === o.key ? chipActive : chipBase} onClick={() => onLangChange(o.key)}>
            {o.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Sort select */}
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        style={{
          height: 38, padding: "0 12px", borderRadius: 8,
          border: "1px solid var(--line)", background: "var(--card)",
          color: "var(--ink)", fontSize: 13, cursor: "pointer",
        }}
      >
        {sortOpts.map((o) => (
          <option key={o.key} value={o.key}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
