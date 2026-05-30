"use client";
import { useEffect, useMemo, useState } from "react";
import { COURSES } from "@/mock/courses";
import { getCourseLessons, getFirstQuizForCourse } from "@/mock/learning";
import { getCourseProgress, getEnrolledCourseIds, getStoredQuizAttempts } from "@/lib/learning/progress-storage";
import { Icon } from "@/components/shared/icon";

export default function StudentDashboard() {
  const [version, setVersion] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialSync = window.setTimeout(() => {
      setMounted(true);
      setVersion((value) => value + 1);
    }, 0);
    const onStorage = () => setVersion((value) => value + 1);
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearTimeout(initialSync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Only show courses the student has actually enrolled in — no default
  const enrolledIds = mounted ? getEnrolledCourseIds([]) : [];
  const enrolled = COURSES.filter((course) => enrolledIds.includes(course.id));
  const attempts = mounted ? getStoredQuizAttempts() : [];
  void version;

  const summaries = enrolled.map((course) => ({
    course,
    lessons: getCourseLessons(course.id),
    progress: mounted
      ? getCourseProgress(course, getCourseLessons(course.id))
      : {
          courseId: course.id,
          totalLessons: getCourseLessons(course.id).length,
          completedLessons: 0,
          percent: 0,
          watchTimeSec: 0,
          latestLessonId: "lesson-1",
        },
    quiz: getFirstQuizForCourse(course.id),
  }));

  const totalCompleted = summaries.reduce((sum, item) => sum + item.progress.completedLessons, 0);
  const totalLessons = summaries.reduce((sum, item) => sum + item.progress.totalLessons, 0);
  const avgProgress = totalLessons ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  const learningHours = Math.round(summaries.reduce((sum, item) => sum + item.progress.watchTimeSec, 0) / 3600 * 10) / 10;

  const stats = [
    { label: "คอร์สที่ลงทะเบียน",  value: String(enrolled.length), icon: "book",  color: "var(--primary)" },
    { label: "ความก้าวหน้าเฉลี่ย", value: `${avgProgress}%`, icon: "clock", color: "var(--accent)" },
    { label: "Quiz ที่ส่งแล้ว",     value: String(attempts.length), icon: "cert",  color: "var(--success)" },
    { label: "ชั่วโมงเรียนทั้งหมด", value: `${learningHours}h`, icon: "clock", color: "var(--lang-ja)" },
  ];

  return (
    <div style={{ padding: 36 }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, color: "var(--ink)" }}>
        สวัสดี, นักเรียน 👋
      </h1>
      <p style={{ margin: "0 0 36px", fontSize: 14, color: "var(--muted)" }}>
        ยินดีต้อนรับกลับสู่ Oak LMS
      </p>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: "var(--card)", border: "1px solid var(--line)",
            borderRadius: 14, padding: 20,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${s.color}18`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: s.color, marginBottom: 14,
            }}>
              <Icon name={s.icon} size={18} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.02em" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Enrolled courses */}
      <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>
        คอร์สที่กำลังเรียน
      </h2>

      {mounted && summaries.length === 0 && (
        <div style={{
          background: "var(--card)", border: "1px dashed var(--line)",
          borderRadius: 16, padding: "48px 32px", textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>
            ยังไม่ได้ลงทะเบียนคอร์สใดเลย
          </h3>
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--muted)" }}>
            เลือกคอร์สที่สนใจแล้วกด "เรียนฟรีเลย" หรือ "ซื้อคอร์ส" เพื่อเริ่มเรียน
          </p>
          <a href="/courses" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 10,
            background: "var(--primary)", color: "#fff",
            fontWeight: 600, fontSize: 14, textDecoration: "none",
          }}>
            ดูคอร์สทั้งหมด →
          </a>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {summaries.map(({ course, progress, quiz }) => {
          const percent = progress.percent;
          return (
            <div key={course.id} style={{
              background: "var(--card)", border: "1px solid var(--line)",
              borderRadius: 14, padding: "18px 22px",
              display: "flex", alignItems: "center", gap: 20,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg,var(--lang-${course.lang === "ja" ? "ja" : course.lang === "zh" ? "zh" : "en"}),#1A3461)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, color: "#fff", fontWeight: 700,
              }}>
                {course.lang === "en" ? "A" : course.lang === "zh" ? "中" : "あ"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)", marginBottom: 6 }}>
                  {course.title.th}
                </div>
                <div style={{ height: 6, background: "var(--line-2)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${percent}%`, height: "100%", background: "var(--accent)", borderRadius: 99, transition: "width .6s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 12, color: "var(--muted)" }}>
                  <span>{percent}% เสร็จแล้ว · {progress.completedLessons}/{progress.totalLessons} บท</span>
                  <span>{Math.round(progress.watchTimeSec / 60)} นาที</span>
                </div>
              </div>
              {quiz && (
                <a href={`/quiz/${quiz.id}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 9,
                  border: "1px solid var(--line)", color: "var(--ink)",
                  fontSize: 13, fontWeight: 600, textDecoration: "none", flexShrink: 0,
                }}>
                  Quiz
                </a>
              )}
              <a href={`/learn/${course.id}/${progress.latestLessonId}`} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 9,
                background: "var(--primary)", color: "#fff",
                fontSize: 13, fontWeight: 600, textDecoration: "none", flexShrink: 0,
              }}>
                <Icon name="play" size={13} />
                เรียนต่อ
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
