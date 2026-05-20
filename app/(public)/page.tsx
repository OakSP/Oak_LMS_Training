"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/hooks/use-lang";
import { COURSES } from "@/mock/courses";
import { PATHS } from "@/mock/paths";
import { INSTRUCTORS } from "@/mock/instructors";
import { LANG_META } from "@/mock/lang-meta";
import { LiveTicker } from "@/components/shared/live-ticker";
import { CourseCard } from "@/components/course/course-card";
import { Icon } from "@/components/shared/icon";
import { Rating } from "@/components/shared/rating";
import type { Course, CourseLang } from "@/types/course";

export default function LandingPage() {
  const { lang, t } = useLang();
  const [activeLang, setActiveLang] = useState<"all" | CourseLang>("all");
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const featured = COURSES[0];
  const filteredCourses = activeLang === "all" ? COURSES : COURSES.filter((c) => c.lang === activeLang);

  const heroStats = [
    { v: "320K+", l: t("hero_stat_1") },
    { v: "240+",  l: t("hero_stat_2") },
    { v: "12",    l: t("hero_stat_3") },
    { v: "4.8/5", l: t("hero_stat_4") },
  ];

  const whyCards = [
    { icon: "users",    title: t("why_1_t"), desc: t("why_1_d") },
    { icon: "clock",    title: t("why_2_t"), desc: t("why_2_d") },
    { icon: "globe",    title: t("why_3_t"), desc: t("why_3_d") },
    { icon: "cert",     title: t("why_4_t"), desc: t("why_4_d") },
  ];

  const langTabs = [
    { key: "all" as const, label: t("flt_all") },
    { key: "en"  as const, label: lang === "en" ? "English" : "อังกฤษ" },
    { key: "zh"  as const, label: lang === "en" ? "Chinese" : "จีน" },
    { key: "ja"  as const, label: lang === "en" ? "Japanese" : "ญี่ปุ่น" },
  ];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: 60, paddingBottom: 90 }}>
        {/* Background floating glyphs */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {(["en", "zh", "ja"] as CourseLang[]).map((l, i) => (
            <div key={l} className={LANG_META[l].scriptClass ?? ""} style={{
              position: "absolute",
              fontSize: 280,
              fontWeight: 700,
              lineHeight: 1,
              color: LANG_META[l].color,
              opacity: .04,
              top: ["-5%", "30%", "10%"][i],
              right: ["-2%", "unset", "unset"][i],
              left: ["unset", "60%", "80%"][i],
              userSelect: "none",
            }}>{LANG_META[l].glyphLong}</div>
          ))}
        </div>

        <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 820 }}>
            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 11.5, fontWeight: 600, letterSpacing: ".14em",
              color: "var(--accent)", textTransform: "uppercase",
              padding: "6px 12px", border: "1px solid var(--accent)",
              borderRadius: 999, marginBottom: 28,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--accent)" }} className="animate-pulse-dot" />
              {t("hero_eyebrow")}
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: "clamp(40px,6.8vw,88px)", fontWeight: 600,
              lineHeight: 1.02, letterSpacing: "-.035em",
              margin: "0 0 28px 0", color: "var(--ink)",
            }}>
              {t("hero_title_a")}<br />
              <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ink-2)" }}>
                {t("hero_title_b")}
              </span>
            </h1>

            <p style={{ fontSize: 17.5, lineHeight: 1.55, color: "var(--muted)", margin: "0 0 36px 0", maxWidth: 560 }}>
              {t("hero_sub")}
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/courses" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                height: 52, padding: "0 24px",
                background: "var(--primary)", color: "#fff", borderRadius: 12,
                fontSize: 15, fontWeight: 600, textDecoration: "none",
                transition: "background .15s ease",
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--primary-2)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--primary)")}>
                {t("hero_cta_a")} <Icon name="arrow" size={16} />
              </Link>
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                height: 52, padding: "0 22px",
                background: "transparent", border: "1px solid var(--line)",
                color: "var(--ink)", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer",
              }}>
                <Icon name="play" size={14} /> {t("hero_cta_b")}
              </button>
            </div>

            {/* Stats */}
            <div style={{
              marginTop: 64,
              display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))",
              gap: 24, maxWidth: 720,
            }}>
              {heroStats.map((s, i) => (
                <div key={i} style={{ borderLeft: "2px solid var(--accent)", paddingLeft: 14 }}>
                  <div style={{ fontSize: 28, fontWeight: 600, color: "var(--ink)", letterSpacing: "-.02em", lineHeight: 1.1 }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE TICKER ──────────────────────────────────────────────── */}
      <LiveTicker />

      {/* ── FEATURED COURSE ──────────────────────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
            <h2 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: "-.02em", color: "var(--ink)" }}>
              {t("sec_featured")}
            </h2>
            <Link href="/courses" style={{ fontSize: 13.5, color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              {t("see_all")} →
            </Link>
          </div>

          {/* Big featured card */}
          <div className="lift" onClick={() => setActiveCourse(featured)} style={{
            borderRadius: 18, overflow: "hidden", cursor: "pointer",
            background: LANG_META[featured.lang].swatch,
            minHeight: 340, position: "relative", padding: 48,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            color: "#fff",
          }}>
            {/* Decorative glyph */}
            <div aria-hidden className={LANG_META[featured.lang].scriptClass ?? ""} style={{
              position: "absolute", right: -30, bottom: -60,
              fontSize: 540, fontWeight: 700, lineHeight: 0.8,
              color: "rgba(255,255,255,.1)", pointerEvents: "none", userSelect: "none",
            }}>{LANG_META[featured.lang].glyphLong}</div>

            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", padding: "4px 10px", borderRadius: 4, background: "var(--accent)", color: "#1a0f00" }}>
                  BESTSELLER
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", padding: "4px 10px", borderRadius: 4, background: "rgba(255,255,255,.2)", backdropFilter: "blur(8px)" }}>
                  {LANG_META[featured.lang].code} · {featured.level}
                </span>
              </div>
              <h3 style={{ margin: "0 0 12px", fontSize: 36, fontWeight: 600, maxWidth: 600, lineHeight: 1.15 }}>
                {lang === "en" ? featured.title.en : featured.title.th}
              </h3>
              <p style={{ margin: "0 0 20px", fontSize: 15, opacity: .85, maxWidth: 480 }}>
                {featured.teacher} · {lang === "en" ? featured.teacherRole.en : featured.teacherRole.th}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <Rating value={featured.rating} size={14} />
                <span style={{ fontSize: 13, opacity: .9 }}>
                  {featured.enrolled.toLocaleString()} {t("enrolled")}
                </span>
                <span style={{ fontSize: 22, fontWeight: 700 }}>
                  {featured.price.toLocaleString()} <span style={{ fontSize: 13, fontWeight: 400, opacity: .8 }}>{t("baht")}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSE CATALOG ───────────────────────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
            <h2 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: "-.02em", color: "var(--ink)" }}>
              {t("sec_catalog")}
            </h2>
            <Link href="/courses" style={{ fontSize: 13.5, color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              {t("see_all")} →
            </Link>
          </div>

          {/* Lang filter chips */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
            {langTabs.map((tab) => {
              const active = activeLang === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveLang(tab.key)} style={{
                  padding: "7px 18px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer",
                  border: "1px solid var(--line)",
                  background: active ? "var(--ink)" : "var(--card)",
                  color: active ? "#fff" : "var(--muted)",
                  transition: "all .15s ease",
                }}>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {filteredCourses.map((course, i) => (
              <div key={course.id} style={{ animationDelay: `${i * 0.04}s` }} className="animate-fade-in">
                <CourseCard course={course} onOpen={setActiveCourse} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEARNING PATHS ───────────────────────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div className="wrap">
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 30, fontWeight: 600, letterSpacing: "-.02em", color: "var(--ink)" }}>
              {t("sec_path")}
            </h2>
            <p style={{ margin: 0, fontSize: 15, color: "var(--muted)" }}>{t("sec_path_sub")}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {PATHS.map((path) => {
              const m = LANG_META[path.lang];
              return (
                <div key={path.id} className="lift" style={{
                  background: "var(--card)", border: "1px solid var(--line)",
                  borderRadius: "var(--radius)", padding: 28, cursor: "pointer",
                  position: "relative", overflow: "hidden",
                }}>
                  <div className={m.scriptClass ?? ""} aria-hidden style={{
                    position: "absolute", right: -10, bottom: -20,
                    fontSize: 100, fontWeight: 700, color: m.color, opacity: .08,
                    userSelect: "none",
                  }}>{m.glyphLong}</div>

                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: m.color, textTransform: "uppercase", display: "block", marginBottom: 12 }}>
                    {lang === "en" ? m.en : m.th}
                  </span>
                  <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600, color: "var(--ink)", lineHeight: 1.3 }}>
                    {lang === "en" ? path.title.en : path.title.th}
                  </h3>
                  <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6 }}>
                    {lang === "en" ? path.desc.en : path.desc.th}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12.5, color: "var(--muted-2)" }}>
                      {lang === "en" ? path.duration.en : path.duration.th}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>
                      {path.enrolled.toLocaleString()} {t("enrolled")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INSTRUCTORS ──────────────────────────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div className="wrap">
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 30, fontWeight: 600, letterSpacing: "-.02em", color: "var(--ink)" }}>
              {t("sec_inst")}
            </h2>
            <p style={{ margin: 0, fontSize: 15, color: "var(--muted)" }}>{t("sec_inst_sub")}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {INSTRUCTORS.map((inst, i) => {
              const m = LANG_META[inst.lang];
              return (
                <div key={i} className="lift" style={{
                  background: "var(--card)", border: "1px solid var(--line)",
                  borderRadius: "var(--radius)", padding: 24, textAlign: "center",
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 999, margin: "0 auto 16px",
                    background: m.swatch, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, fontWeight: 700, color: "#fff",
                  }} className={m.scriptClass ?? ""}>
                    {m.glyph}
                  </div>
                  <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{inst.name}</h4>
                  <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--muted)" }}>
                    {lang === "en" ? inst.role.en : inst.role.th}
                  </p>
                  <Rating value={inst.rating} size={12} />
                  <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 20, fontSize: 12, color: "var(--muted)" }}>
                    <span>{inst.students.toLocaleString()} {t("enrolled")}</span>
                    <span>{inst.courses} {t("lessons")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY OAK ──────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div className="wrap">
          <h2 style={{ margin: "0 0 40px", fontSize: 30, fontWeight: 600, letterSpacing: "-.02em", color: "var(--ink)" }}>
            {t("sec_why")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {whyCards.map((card, i) => (
              <div key={i} style={{ padding: 24, background: "var(--card)", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: "var(--line-2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)", marginBottom: 16,
                }}>
                  <Icon name={card.icon} size={20} />
                </div>
                <h4 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{card.title}</h4>
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────────── */}
      <section style={{ margin: "80px 0 0" }}>
        <div className="wrap">
          <div style={{
            background: "var(--primary)", borderRadius: 20, padding: "60px 48px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40,
          }}>
            <div>
              <h2 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 600, color: "#fff", letterSpacing: "-.02em" }}>
                {lang === "en" ? "Start your language journey today" : "เริ่มเส้นทางภาษาของคุณวันนี้"}
              </h2>
              <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,.7)" }}>
                {lang === "en" ? "Join 320,000+ learners across Asia" : "ร่วมกับผู้เรียนกว่า 320,000 คนทั่วเอเชีย"}
              </p>
            </div>
            <Link href="/register" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              height: 52, padding: "0 28px", flexShrink: 0,
              background: "var(--accent)", color: "#1a0f00",
              borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none",
            }}>
              {t("nav_signup")} <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── COURSE DETAIL MODAL ──────────────────────────────────────── */}
      {activeCourse && (
        <div
          onClick={() => setActiveCourse(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(10,21,48,.55)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-scale-in"
            style={{
              background: "var(--card)", borderRadius: 22,
              width: "min(900px,100%)", maxHeight: "90vh", overflow: "auto",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {/* Modal header (thumbnail) */}
            <div style={{ position: "relative", height: 220, background: LANG_META[activeCourse.lang].swatch, overflow: "hidden" }}>
              <div aria-hidden className={LANG_META[activeCourse.lang].scriptClass ?? ""} style={{
                position: "absolute", right: -20, bottom: -60,
                fontSize: 420, fontWeight: 700, lineHeight: 0.8, color: "rgba(255,255,255,.1)", pointerEvents: "none",
              }}>{LANG_META[activeCourse.lang].glyphLong}</div>
              <div style={{ position: "relative", padding: 36, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#fff" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {activeCourse.badge && <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "var(--accent)", color: "#1a0f00" }}>{activeCourse.badge.toUpperCase()}</span>}
                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,.2)" }}>
                    {LANG_META[activeCourse.lang].code} · {activeCourse.level}
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600, lineHeight: 1.2 }}>
                  {lang === "en" ? activeCourse.title.en : activeCourse.title.th}
                </h2>
              </div>
              <button onClick={() => setActiveCourse(null)} style={{
                position: "absolute", top: 16, right: 16,
                background: "rgba(0,0,0,.3)", border: "none", borderRadius: 999,
                width: 36, height: 36, color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="x" size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: 36, display: "grid", gridTemplateColumns: "1fr 300px", gap: 40 }}>
              {/* Left: details */}
              <div>
                <p style={{ margin: "0 0 24px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.7 }}>
                  {lang === "en" ? activeCourse.desc.en : activeCourse.desc.th}
                </p>

                <h4 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{t("what_learn")}</h4>
                <ul style={{ margin: "0 0 24px", padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {(lang === "en" ? activeCourse.learn.en : activeCourse.learn.th).map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "var(--muted)" }}>
                      <Icon name="check" size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} />
                      {item}
                    </li>
                  ))}
                </ul>

                <h4 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{t("curriculum")}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {activeCourse.chapters.map((ch, i) => (
                    <div key={i} style={{
                      padding: "12px 16px", background: "var(--bg-2)",
                      borderRadius: 10, display: "flex", justifyContent: "space-between",
                      fontSize: 13.5, color: "var(--muted)",
                    }}>
                      <span style={{ fontWeight: 500, color: "var(--ink)" }}>{lang === "en" ? ch.en : ch.th}</span>
                      <span>{ch.lessons} {t("lessons")} · {ch.dur}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: purchase panel */}
              <div style={{ position: "sticky", top: 20, alignSelf: "start" }}>
                <div style={{ border: "1px solid var(--line)", borderRadius: 16, padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)" }}>
                      {activeCourse.price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>{t("baht")}</span>
                    {activeCourse.oldPrice && (
                      <span style={{ fontSize: 14, color: "var(--muted-2)", textDecoration: "line-through" }}>
                        {activeCourse.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Rating value={activeCourse.rating} />
                  <p style={{ margin: "4px 0 20px", fontSize: 12.5, color: "var(--muted)" }}>
                    {activeCourse.ratings.toLocaleString()} {lang === "en" ? "reviews" : "รีวิว"}
                  </p>

                  <Link href={`/courses/${activeCourse.id}`} style={{
                    display: "block", padding: "13px 0", textAlign: "center",
                    background: "var(--primary)", color: "#fff", borderRadius: 10,
                    fontWeight: 600, fontSize: 15, textDecoration: "none", marginBottom: 10,
                  }}>
                    {t("buy_now")}
                  </Link>
                  <button style={{
                    width: "100%", padding: "13px 0", borderRadius: 10,
                    border: "1px solid var(--line)", background: "transparent",
                    color: "var(--ink)", fontWeight: 600, fontSize: 15, cursor: "pointer",
                  }}>
                    {t("add_cart")}
                  </button>

                  <ul style={{ margin: "20px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { icon: "infinity", label: t("lifetime") },
                      { icon: "cert",     label: t("cert_inc") },
                      { icon: "device",   label: t("device_any") },
                    ].map((item, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--muted)", alignItems: "center" }}>
                        <Icon name={item.icon} size={15} style={{ color: "var(--success)" }} />
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
