"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/hooks/use-lang";
import { COURSES } from "@/mock/courses";
import { CourseCard } from "@/components/course/course-card";
import { CourseFilters } from "@/components/course/course-filters";
import { Icon } from "@/components/shared/icon";
import type { Course, CourseLang } from "@/types/course";

type LangFilter = "all" | CourseLang;
type SortOption = "pop" | "new" | "rating";
type PriceFilter = "all" | "free" | "paid";

export default function CoursesPage() {
  const router = useRouter();
  const { lang, t } = useLang();
  const [activeLang, setActiveLang] = useState<LangFilter>("all");
  const [sort, setSort] = useState<SortOption>("pop");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [query, setQuery] = useState(() =>
    typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("q") ?? ""
  );
  const [allCourses, setAllCourses] = useState<Course[]>(COURSES);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Fetch from API on mount — if DB is connected, API returns real courses
  useEffect(() => {
    setLoadingCourses(true);
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data: { data?: Course[] }) => {
        if (Array.isArray(data.data) && data.data.length > 0) {
          setAllCourses(data.data);
        }
      })
      .catch(() => {}) // fallback to COURSES mock on error
      .finally(() => setLoadingCourses(false));
  }, []);

  const filtered = useMemo(() => {
    let list = activeLang === "all" ? allCourses : allCourses.filter((c) => c.lang === activeLang);

    if (priceFilter === "free") list = list.filter((c) => c.price === 0);
    if (priceFilter === "paid") list = list.filter((c) => c.price > 0);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => {
        const title = typeof c.title === "string" ? c.title : `${c.title.th} ${c.title.en}`;
        const teacher = c.teacher ?? "";
        return title.toLowerCase().includes(q) || teacher.toLowerCase().includes(q);
      });
    }

    if (sort === "rating") list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "pop")    list = [...list].sort((a, b) => (b.enrolled ?? 0) - (a.enrolled ?? 0));
    return list;
  }, [activeLang, sort, priceFilter, query, allCourses]);

  return (
    <div style={{ padding: "48px 0 80px" }}>
      <div className="wrap">
        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 36, fontWeight: 600, color: "var(--ink)", letterSpacing: "-.025em" }}>
            {t("sec_catalog")}
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)" }}>
            {loadingCourses ? "กำลังโหลด..." : `${filtered.length} ${lang === "en" ? "courses available" : "คอร์ส"}`}
          </p>
        </div>

        {/* Search bar */}
        <div style={{ position: "relative", maxWidth: 540, marginBottom: 20 }}>
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

        {/* Price filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["all", "free", "paid"] as PriceFilter[]).map((p) => (
            <button
              key={p}
              onClick={() => setPriceFilter(p)}
              style={{
                padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                border: "1px solid var(--line)", cursor: "pointer", fontFamily: "inherit",
                background: priceFilter === p ? "var(--primary)" : "var(--card)",
                color: priceFilter === p ? "#fff" : "var(--muted)",
                transition: "all .15s",
              }}
            >
              {p === "all" ? (lang === "en" ? "All Prices" : "ทุกราคา") : p === "free" ? (lang === "en" ? "Free" : "ฟรี") : (lang === "en" ? "Paid" : "มีค่าใช้จ่าย")}
            </button>
          ))}
        </div>

        {/* Language + Sort Filters */}
        <CourseFilters
          activeLang={activeLang}
          sort={sort}
          onLangChange={setActiveLang}
          onSortChange={setSort}
        />

        {/* Grid */}
        {loadingCourses ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} style={{ height: 280, borderRadius: 16, background: "var(--line-2)", animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
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
