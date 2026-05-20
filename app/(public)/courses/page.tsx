"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/hooks/use-lang";
import { COURSES } from "@/mock/courses";
import { CourseCard } from "@/components/course/course-card";
import { CourseFilters } from "@/components/course/course-filters";
import { Icon } from "@/components/shared/icon";
import type { CourseLang } from "@/types/course";

type LangFilter = "all" | CourseLang;
type SortOption = "pop" | "new" | "rating";

export default function CoursesPage() {
  const router = useRouter();
  const { lang, t } = useLang();
  const [activeLang, setActiveLang] = useState<LangFilter>("all");
  const [sort, setSort] = useState<SortOption>("pop");
  const [query, setQuery] = useState(() => typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("q") ?? "");

  const filtered = useMemo(() => {
    let list = activeLang === "all" ? COURSES : COURSES.filter((c) => c.lang === activeLang);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) =>
        c.title.th.toLowerCase().includes(q) ||
        c.title.en.toLowerCase().includes(q) ||
        c.teacher.toLowerCase().includes(q)
      );
    }
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "pop")    list = [...list].sort((a, b) => b.enrolled - a.enrolled);
    return list;
  }, [activeLang, sort, query]);

  return (
    <div style={{ padding: "48px 0 80px" }}>
      <div className="wrap">
        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 36, fontWeight: 600, color: "var(--ink)", letterSpacing: "-.025em" }}>
            {t("sec_catalog")}
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)" }}>
            {filtered.length} {lang === "en" ? "courses available" : "คอร์ส"}
          </p>
        </div>

        {/* Search bar */}
        <div style={{ position: "relative", maxWidth: 540, marginBottom: 28 }}>
          <Icon name="search" size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_ph")}
            style={{
              width: "100%", height: 46, paddingLeft: 42, paddingRight: 14,
              borderRadius: 12, border: "1px solid var(--line)",
              background: "var(--card)", color: "var(--ink)",
              fontSize: 14, fontFamily: "inherit", outline: "none",
            }}
          />
        </div>

        {/* Filters */}
        <CourseFilters
          activeLang={activeLang}
          sort={sort}
          onLangChange={setActiveLang}
          onSortChange={setSort}
        />

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
            <Icon name="search" size={40} style={{ opacity: .3, display: "block", margin: "0 auto 16px" }} />
            <p style={{ fontSize: 16 }}>{lang === "en" ? "No courses found" : "ไม่พบคอร์สที่ตรงกัน"}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {filtered.map((course, i) => (
              <div key={course.id} style={{ animationDelay: `${i * 0.04}s` }} className="animate-fade-in">
                <CourseCard course={course} onOpen={() => router.push(`/courses/${course.id}`)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
