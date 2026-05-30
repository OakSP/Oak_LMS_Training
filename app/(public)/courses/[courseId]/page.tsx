"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/hooks/use-lang";
import { COURSES } from "@/mock/courses";
import { LANG_META } from "@/mock/lang-meta";
import { CourseThumb } from "@/components/course/course-thumbnail";
import { Rating } from "@/components/shared/rating";
import { Icon } from "@/components/shared/icon";
import { EnrollButton } from "@/components/course/enroll-button";

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { lang, t } = useLang();
  const course = COURSES.find((c) => c.id === courseId);
  if (!course) notFound();

  const m = LANG_META[course.lang];
  const title = lang === "en" ? course.title.en : course.title.th;
  const desc  = lang === "en" ? course.desc.en  : course.desc.th;

  return (
    <div style={{ padding: "0 0 80px" }}>
      {/* Hero banner */}
      <div style={{ background: m.swatch, position: "relative", overflow: "hidden", padding: "60px 0 50px" }}>
        <div aria-hidden className={m.scriptClass ?? ""} style={{
          position: "absolute", right: -30, bottom: -60,
          fontSize: 500, fontWeight: 700, lineHeight: 0.8,
          color: "rgba(255,255,255,.1)", pointerEvents: "none", userSelect: "none",
        }}>{m.glyphLong}</div>
        <div className="wrap" style={{ position: "relative", color: "#fff" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {course.badge && <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 4, background: "var(--accent)", color: "#1a0f00" }}>{course.badge.toUpperCase()}</span>}
            <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 4, background: "rgba(255,255,255,.2)" }}>{m.code} · {course.level}</span>
          </div>
          <h1 style={{ margin: "0 0 14px", fontSize: "clamp(26px,4vw,42px)", fontWeight: 600, maxWidth: 680, lineHeight: 1.15 }}>{title}</h1>
          <p style={{ margin: "0 0 20px", fontSize: 16, opacity: .85, maxWidth: 560, lineHeight: 1.6 }}>{desc}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Rating value={course.rating} size={15} />
            <span style={{ fontSize: 14, opacity: .9 }}>{course.ratings.toLocaleString()} {lang === "en" ? "reviews" : "รีวิว"}</span>
            <span style={{ fontSize: 14, opacity: .9 }}>{course.enrolled.toLocaleString()} {t("enrolled")}</span>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 14, opacity: .8 }}>
            {lang === "en" ? "Instructor:" : "ผู้สอน:"} <strong>{course.teacher}</strong> — {lang === "en" ? course.teacherRole.en : course.teacherRole.th}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="wrap" style={{ paddingTop: 48, display: "grid", gridTemplateColumns: "1fr 340px", gap: 48, alignItems: "start" }}>
        {/* Left */}
        <div>
          {/* What you'll learn */}
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>{t("what_learn")}</h2>
            <div style={{
              background: "var(--bg-2)", border: "1px solid var(--line)",
              borderRadius: 14, padding: 24,
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
            }}>
              {(lang === "en" ? course.learn.en : course.learn.th).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--muted)", alignItems: "flex-start" }}>
                  <Icon name="check" size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: 3 }} />
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum */}
          <section>
            <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>{t("curriculum")}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {course.chapters.map((ch, i) => (
                <div key={i} style={{
                  padding: "14px 18px", background: "var(--card)",
                  border: "1px solid var(--line)", borderRadius: 12,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 999, background: "var(--line-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>
                      {i + 1}
                    </span>
                    <span style={{ fontWeight: 500, fontSize: 14.5, color: "var(--ink)" }}>{lang === "en" ? ch.en : ch.th}</span>
                  </div>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{ch.lessons} {t("lessons")} · {ch.dur}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: sticky purchase card */}
        <div style={{ position: "sticky", top: 90 }}>
          <div style={{ border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
            <CourseThumb course={course} size="lg" titleOverride={title} />
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: "var(--ink)" }}>{course.price.toLocaleString()}</span>
                <span style={{ fontSize: 14, color: "var(--muted)" }}>{t("baht")}</span>
                {course.oldPrice && (
                  <span style={{ fontSize: 16, color: "var(--muted-2)", textDecoration: "line-through" }}>
                    {course.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {course.oldPrice && (
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)", display: "block", marginBottom: 16 }}>
                  {lang === "en" ? "Limited time offer!" : "ราคาพิเศษ!"}
                  {" "}−{Math.round((1 - course.price / course.oldPrice) * 100)}%
                </span>
              )}

              <EnrollButton
                courseId={course.id}
                firstLessonId="lesson-1"
                price={course.price}
                isFree={course.price === 0}
                label={course.price === 0 ? t("buy_now") : `${t("buy_now")} ฿${course.price.toLocaleString()}`}
              />

              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "infinity", label: t("lifetime") },
                  { icon: "cert",     label: t("cert_inc") },
                  { icon: "device",   label: t("device_any") },
                  { icon: "book",     label: `${course.lessons} ${t("lessons")}` },
                  { icon: "clock",    label: `${course.hours} ${t("hours")}` },
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "var(--muted)", alignItems: "center" }}>
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
  );
}
