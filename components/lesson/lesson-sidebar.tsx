import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import type { Course } from "@/types/course";
import type { LearningLesson, StoredLessonProgress } from "@/types/learning";

interface LessonSidebarProps {
  course: Course;
  lessons: LearningLesson[];
  currentLessonId: string;
  progress: Record<string, StoredLessonProgress>;
  quizIdsByLessonId: Record<string, string>;
}

export function LessonSidebar({ course, lessons, currentLessonId, progress, quizIdsByLessonId }: LessonSidebarProps) {
  return (
    <aside style={{
      border: "1px solid var(--line)",
      borderRadius: 14,
      background: "var(--card)",
      overflow: "hidden",
      position: "sticky",
      top: 24,
    }}>
      <div style={{ padding: 18, borderBottom: "1px solid var(--line)" }}>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5 }}>Course lessons</div>
        <h2 style={{ margin: 0, fontSize: 16, color: "var(--ink)", lineHeight: 1.35 }}>{course.title.th}</h2>
      </div>
      <div style={{ maxHeight: "calc(100vh - 170px)", overflow: "auto" }}>
        {lessons.map((lesson) => {
          const active = lesson.id === currentLessonId;
          const done = progress[`${course.id}:${lesson.id}`]?.isCompleted;
          const href = lesson.type === "quiz" && quizIdsByLessonId[lesson.id]
            ? `/quiz/${quizIdsByLessonId[lesson.id]}`
            : `/learn/${course.id}/${lesson.id}`;

          return (
            <Link
              key={lesson.id}
              href={href}
              style={{
                display: "grid",
                gridTemplateColumns: "24px 1fr auto",
                gap: 10,
                alignItems: "center",
                padding: "12px 14px",
                borderBottom: "1px solid var(--line)",
                textDecoration: "none",
                background: active ? "var(--line-2)" : "transparent",
                color: active ? "var(--primary)" : "var(--ink)",
              }}
            >
              <span style={{
                width: 24,
                height: 24,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: done ? "var(--success)" : active ? "var(--primary)" : "var(--line-2)",
                color: done || active ? "#fff" : "var(--muted)",
                fontSize: 11,
                fontWeight: 700,
              }}>
                {done ? <Icon name="check" size={13} /> : lesson.position}
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 13.5, fontWeight: active ? 700 : 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {lesson.title.th}
                </span>
                <span style={{ display: "block", fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}>
                  {lesson.type.toUpperCase()} · {Math.round(lesson.durationSec / 60)} นาที
                </span>
              </span>
              {lesson.type === "quiz" && (
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)" }}>QUIZ</span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
