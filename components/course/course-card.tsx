"use client";
import { useLang } from "@/hooks/use-lang";
import { LANG_META } from "@/mock/lang-meta";
import { Icon } from "@/components/shared/icon";
import { Rating } from "@/components/shared/rating";
import { CourseThumb } from "./course-thumbnail";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  onOpen?: (c: Course) => void;
}

export function CourseCard({ course, onOpen }: CourseCardProps) {
  const { lang, t } = useLang();
  const m = LANG_META[course.lang];
  const title = lang === "en" ? course.title.en : course.title.th;
  const discountPct = course.oldPrice ? Math.round((1 - course.price / course.oldPrice) * 100) : 0;

  return (
    <article
      className="lift"
      onClick={() => onOpen?.(course)}
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: 10, paddingBottom: 0 }}>
        <CourseThumb course={course} titleOverride={title} />
      </div>

      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {/* Language + Level */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", color: m.color, textTransform: "uppercase" }}>
            {lang === "en" ? m.en : m.th}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: 99, background: "var(--muted-2)" }} />
          <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{course.level}</span>
        </div>

        {/* Title */}
        <h3 style={{
          margin: 0, fontSize: 15.5, fontWeight: 600, color: "var(--ink)",
          lineHeight: 1.35, letterSpacing: "-.01em",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          minHeight: 42,
        }}>{title}</h3>

        {/* Teacher */}
        <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{course.teacher}</div>

        {/* Rating + stats */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "var(--muted)" }}>
          <Rating value={course.rating} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="users" size={13} /> {course.enrolled.toLocaleString()}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="clock" size={13} /> {course.hours}{lang === "en" ? "h" : " ชม."}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.01em" }}>
              {course.price.toLocaleString()}{" "}
              <span style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)" }}>{t("baht")}</span>
            </span>
            {course.oldPrice && (
              <span style={{ fontSize: 12.5, color: "var(--muted-2)", textDecoration: "line-through" }}>
                {course.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          {discountPct > 0 && (
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--accent)", letterSpacing: ".04em" }}>
              -{discountPct}%
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
