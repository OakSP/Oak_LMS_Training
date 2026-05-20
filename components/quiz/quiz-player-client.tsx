"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { LessonProgressBar } from "@/components/lesson/lesson-progress-bar";
import { QuizQuestion } from "@/components/quiz/quiz-question";
import { QuizTimer } from "@/components/quiz/quiz-timer";
import { QuizResult } from "@/components/quiz/quiz-result";
import { QuizReview } from "@/components/quiz/quiz-review";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { useQuizTimer } from "@/hooks/use-quiz-timer";
import type { Course } from "@/types/course";
import type { LearningLesson } from "@/types/learning";
import type { Quiz } from "@/types/quiz";

interface QuizPlayerClientProps {
  quiz: Quiz;
  course: Course;
  lesson: LearningLesson;
}

interface SubmitResult {
  score: number;
  isPassed: boolean;
  correctCount: number;
}

export function QuizPlayerClient({ quiz, course, lesson }: QuizPlayerClientProps) {
  const [answers, setAnswers] = useState<number[]>(() => quiz.questions.map(() => -1));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const { complete, saveQuiz, enroll } = useCourseProgress(course.id);
  const timer = useQuizTimer(quiz.timeLimitSec, !result);

  const answeredCount = answers.filter((answer) => answer >= 0).length;
  const answerPercent = Math.round((answeredCount / quiz.questions.length) * 100);
  const canSubmit = answeredCount === quiz.questions.length && !submitting;

  useEffect(() => {
    enroll();
    void fetch(`/api/quizzes/${quiz.id}/attempt`, { method: "POST" }).catch(() => null);
  }, [enroll, quiz.id]);

  const submitQuiz = useCallback(async (nextAnswers = answers) => {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers }),
      });
      const data = await res.json();
      const nextResult: SubmitResult = {
        score: data.score,
        isPassed: data.isPassed,
        correctCount: data.correctCount,
      };
      setResult(nextResult);
      saveQuiz({ quizId: quiz.id, score: nextResult.score, isPassed: nextResult.isPassed, answers: nextAnswers });
      await complete(lesson);
    } finally {
      setSubmitting(false);
    }
  }, [answers, complete, lesson, quiz.id, result, saveQuiz, submitting]);

  useEffect(() => {
    if (timer.isExpired && !result) {
      const timeout = window.setTimeout(() => void submitQuiz(answers), 0);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [answers, result, submitQuiz, timer.isExpired]);

  const resultPercent = useMemo(() => result?.score ?? 0, [result]);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>
            <Link href={`/learn/${course.id}/${lesson.id}`} style={{ color: "var(--muted)", textDecoration: "none", fontSize: 13 }}>
              ← กลับบทเรียน
            </Link>
            <h1 style={{ margin: "8px 0 6px", fontSize: 26, color: "var(--ink)", letterSpacing: "-.02em" }}>{quiz.title}</h1>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
              {course.title.th} · ผ่านที่ {quiz.passPercent}% · ทำได้สูงสุด {quiz.maxAttempts} ครั้ง
            </p>
          </div>
          <QuizTimer formatted={timer.formatted} isExpired={timer.isExpired} />
        </div>

        <section style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--card)", padding: 18 }}>
          <LessonProgressBar percent={result ? resultPercent : answerPercent} label={result ? "คะแนน Quiz" : "ตอบคำถามแล้ว"} />
        </section>

        {result ? (
          <>
            <QuizResult
              score={result.score}
              passPercent={quiz.passPercent}
              isPassed={result.isPassed}
              courseId={course.id}
              lessonId={lesson.id}
            />
            <QuizReview questions={quiz.questions} answers={answers} />
          </>
        ) : (
          <>
            <div style={{ display: "grid", gap: 14 }}>
              {quiz.questions.map((question, index) => (
                <QuizQuestion
                  key={question.id}
                  question={question}
                  index={index}
                  selectedIndex={answers[index]}
                  onSelect={(selected) => {
                    setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? selected : answer));
                  }}
                />
              ))}
            </div>
            <div style={{
              position: "sticky",
              bottom: 18,
              border: "1px solid var(--line)",
              borderRadius: 14,
              background: "color-mix(in srgb,var(--card) 94%,transparent)",
              backdropFilter: "blur(14px)",
              padding: 14,
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              alignItems: "center",
              boxShadow: "var(--shadow-md)",
            }}>
              <span style={{ color: "var(--muted)", fontSize: 13 }}>
                ตอบแล้ว {answeredCount}/{quiz.questions.length} ข้อ
              </span>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => void submitQuiz()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  height: 42,
                  padding: "0 18px",
                  borderRadius: 10,
                  border: "none",
                  background: canSubmit ? "var(--primary)" : "var(--muted-2)",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}
              >
                <Icon name="check" size={16} />
                {submitting ? "กำลังส่ง..." : "ส่งคำตอบ"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
