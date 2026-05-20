"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { LessonProgressBar } from "@/components/lesson/lesson-progress-bar";
import { LessonSidebar } from "@/components/lesson/lesson-sidebar";
import { VideoPlayer } from "@/components/lesson/video-player";
import { PdfViewer } from "@/components/lesson/pdf-viewer";
import { useCourseProgress } from "@/hooks/use-course-progress";
import type { Course } from "@/types/course";
import type { LearningLesson } from "@/types/learning";

interface LessonPlayerClientProps {
  course: Course;
  lesson: LearningLesson;
  lessons: LearningLesson[];
  previousLesson: LearningLesson | null;
  nextLesson: LearningLesson | null;
  quizIdsByLessonId: Record<string, string>;
}

function TextLesson({ lesson }: { lesson: LearningLesson }) {
  return (
    <div style={{
      border: "1px solid var(--line)",
      borderRadius: 16,
      padding: 32,
      background: "var(--card)",
      boxShadow: "var(--shadow-sm)",
      lineHeight: 1.8,
    }}>
      <p style={{ margin: "0 0 18px", color: "var(--muted)" }}>{lesson.description.th}</p>
      <h3 style={{ margin: "0 0 12px", fontSize: 18, color: "var(--ink)" }}>แนวทางฝึกในบทนี้</h3>
      <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)" }}>
        <li>อ่าน concept หลักและตัวอย่างก่อนเริ่มฝึก</li>
        <li>จดคำศัพท์หรือรูปประโยคที่ใช้ซ้ำบ่อย</li>
        <li>กดเรียนจบเมื่อทบทวนครบ เพื่อบันทึก progress</li>
      </ul>
    </div>
  );
}

export function LessonPlayerClient({
  course,
  lesson,
  lessons,
  previousLesson,
  nextLesson,
  quizIdsByLessonId,
}: LessonPlayerClientProps) {
  const { progress, save, complete, enroll } = useCourseProgress(course.id);
  const currentProgress = progress[`${course.id}:${lesson.id}`];
  const courseProgress = useMemo(() => {
    const completedLessons = lessons.filter((item) => progress[`${course.id}:${item.id}`]?.isCompleted).length;
    return lessons.length === 0 ? 0 : Math.round((completedLessons / lessons.length) * 100);
  }, [course.id, lessons, progress]);

  const saveProgress = useCallback(
    (watchTime: number, isCompleted = false) => {
      void save(lesson, watchTime, isCompleted);
    },
    [lesson, save],
  );

  const completeLesson = useCallback(() => {
    enroll();
    void complete(lesson);
  }, [complete, enroll, lesson]);

  const quizId = quizIdsByLessonId[lesson.id];

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", marginBottom: 22 }}>
        <div>
          <Link href={`/courses/${course.id}`} style={{ color: "var(--muted)", fontSize: 13, textDecoration: "none" }}>
            ← กลับไปหน้าคอร์ส
          </Link>
          <h1 style={{ margin: "8px 0 6px", fontSize: 25, fontWeight: 700, color: "var(--ink)" }}>{lesson.title.th}</h1>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>{course.title.th}</p>
        </div>
        <button
          onClick={completeLesson}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            height: 42,
            padding: "0 16px",
            borderRadius: 10,
            border: "none",
            background: currentProgress?.isCompleted ? "var(--success)" : "var(--primary)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Icon name="check" size={16} />
          {currentProgress?.isCompleted ? "เรียนจบแล้ว" : "ทำเครื่องหมายว่าเรียนจบ"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 24, alignItems: "start" }}>
        <main style={{ display: "grid", gap: 20 }}>
          <section style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--card)", padding: 18 }}>
            <LessonProgressBar percent={courseProgress} label="ความก้าวหน้าทั้งคอร์ส" />
          </section>

          {lesson.type === "video" && (
            <VideoPlayer
              key={lesson.id}
              lesson={lesson}
              initialWatchTime={currentProgress?.watchTime ?? 0}
              onProgress={saveProgress}
            />
          )}

          {lesson.type === "pdf" && <PdfViewer lesson={lesson} />}
          {lesson.type === "text" && <TextLesson lesson={lesson} />}

          {lesson.type === "quiz" && quizId && (
            <div style={{
              border: "1px solid var(--line)",
              borderRadius: 16,
              background: "var(--card)",
              padding: 32,
              display: "grid",
              gap: 16,
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--accent)", color: "#1a0f00", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="cert" size={24} />
              </div>
              <div>
                <h2 style={{ margin: "0 0 8px", fontSize: 22, color: "var(--ink)" }}>ถึงเวลา Quiz แล้วค่ะ</h2>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                  แบบทดสอบนี้ใช้วัดความเข้าใจของบทเรียน และจะนับเป็น progress เมื่อส่งคำตอบเรียบร้อย
                </p>
              </div>
              <Link href={`/quiz/${quizId}`} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                width: "fit-content",
                height: 42,
                padding: "0 16px",
                borderRadius: 10,
                background: "var(--primary)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
              }}>
                <Icon name="play" size={15} />
                เริ่มทำ Quiz
              </Link>
            </div>
          )}

          <section style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            {previousLesson ? (
              <Link href={`/learn/${course.id}/${previousLesson.id}`} style={{
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid var(--line)",
                color: "var(--ink)",
                textDecoration: "none",
                fontWeight: 700,
              }}>
                ← บทก่อนหน้า
              </Link>
            ) : <span />}
            {nextLesson ? (
              <Link href={nextLesson.type === "quiz" && quizIdsByLessonId[nextLesson.id] ? `/quiz/${quizIdsByLessonId[nextLesson.id]}` : `/learn/${course.id}/${nextLesson.id}`} style={{
                padding: "12px 16px",
                borderRadius: 10,
                background: "var(--primary)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
              }}>
                บทถัดไป →
              </Link>
            ) : (
              <Link href={`/dashboard/student`} style={{
                padding: "12px 16px",
                borderRadius: 10,
                background: "var(--success)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
              }}>
                กลับ Dashboard
              </Link>
            )}
          </section>

          <section style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--card)", padding: 18 }}>
            <h2 style={{ margin: "0 0 14px", fontSize: 17, color: "var(--ink)" }}>ไฟล์ประกอบบทเรียน</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {lesson.resources.map((resource) => (
                <div key={resource.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "10px 12px", borderRadius: 10, background: "var(--bg-2)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--ink)", fontWeight: 600 }}>
                    <Icon name="book" size={15} />
                    {resource.title}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{resource.kind} · {resource.sizeLabel}</span>
                </div>
              ))}
            </div>
          </section>
        </main>

        <LessonSidebar
          course={course}
          lessons={lessons}
          currentLessonId={lesson.id}
          progress={progress}
          quizIdsByLessonId={quizIdsByLessonId}
        />
      </div>
    </div>
  );
}
