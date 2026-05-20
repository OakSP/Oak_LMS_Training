"use client";

import { useCallback, useEffect, useState } from "react";
import { saveLessonProgress, markLessonCompleted, getStoredProgress, enrollCourse, saveQuizAttempt } from "@/lib/learning/progress-storage";
import type { LearningLesson, StoredLessonProgress } from "@/types/learning";

export function useCourseProgress(courseId: string) {
  const [progress, setProgress] = useState<Record<string, StoredLessonProgress>>(() => getStoredProgress());

  const refresh = useCallback(() => {
    setProgress(getStoredProgress());
  }, []);

  useEffect(() => {
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [refresh]);

  const save = useCallback(
    async (lesson: LearningLesson, watchTime: number, isCompleted = false) => {
      const stored = saveLessonProgress({
        courseId,
        lessonId: lesson.id,
        watchTime,
        durationSec: lesson.durationSec,
        isCompleted,
      });
      setProgress(getStoredProgress());

      await fetch(`/api/lessons/${lesson.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          watchTime: stored.watchTime,
          durationSec: stored.durationSec,
          isCompleted: stored.isCompleted,
        }),
      }).catch(() => null);

      return stored;
    },
    [courseId],
  );

  const complete = useCallback(
    async (lesson: LearningLesson) => {
      const stored = markLessonCompleted(courseId, lesson);
      setProgress(getStoredProgress());

      await fetch(`/api/lessons/${lesson.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          watchTime: lesson.durationSec,
          durationSec: lesson.durationSec,
          isCompleted: true,
        }),
      }).catch(() => null);

      return stored;
    },
    [courseId],
  );

  const enroll = useCallback(() => {
    const ids = enrollCourse(courseId);
    refresh();
    return ids;
  }, [courseId, refresh]);

  const saveQuiz = useCallback(
    (input: { quizId: string; score: number; isPassed: boolean; answers: number[] }) => {
      const attempt = saveQuizAttempt({ courseId, ...input });
      refresh();
      return attempt;
    },
    [courseId, refresh],
  );

  return { progress, save, complete, enroll, saveQuiz, refresh };
}
