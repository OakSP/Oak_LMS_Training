import type { Course } from "@/types/course";
import type { LearningLesson, StoredLessonProgress, CourseProgressSummary } from "@/types/learning";

const PROGRESS_KEY = "oak-lms-progress-v1";
const ENROLLMENT_KEY = "oak-lms-enrollments-v1";
const QUIZ_ATTEMPTS_KEY = "oak-lms-quiz-attempts-v1";

export interface StoredQuizAttempt {
  id: string;
  quizId: string;
  courseId: string;
  score: number;
  isPassed: boolean;
  answers: number[];
  submittedAt: string;
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function progressKey(courseId: string, lessonId: string) {
  return `${courseId}:${lessonId}`;
}

export function getStoredProgress() {
  return readJson<Record<string, StoredLessonProgress>>(PROGRESS_KEY, {});
}

export function saveLessonProgress(input: {
  courseId: string;
  lessonId: string;
  watchTime: number;
  durationSec: number;
  isCompleted?: boolean;
}) {
  const all = getStoredProgress();
  const key = progressKey(input.courseId, input.lessonId);
  const previous = all[key];
  const watchTime = Math.max(previous?.watchTime ?? 0, Math.min(input.watchTime, input.durationSec));
  const completed = input.isCompleted ?? previous?.isCompleted ?? watchTime >= Math.round(input.durationSec * 0.9);

  all[key] = {
    courseId: input.courseId,
    lessonId: input.lessonId,
    watchTime,
    durationSec: input.durationSec,
    isCompleted: completed,
    completedAt: completed ? previous?.completedAt ?? new Date().toISOString() : null,
    updatedAt: new Date().toISOString(),
  };
  writeJson(PROGRESS_KEY, all);
  return all[key];
}

export function markLessonCompleted(courseId: string, lesson: LearningLesson) {
  return saveLessonProgress({
    courseId,
    lessonId: lesson.id,
    watchTime: lesson.durationSec,
    durationSec: lesson.durationSec,
    isCompleted: true,
  });
}

export function getLessonProgress(courseId: string, lessonId: string) {
  return getStoredProgress()[progressKey(courseId, lessonId)] ?? null;
}

export function getEnrolledCourseIds(defaultCourseIds: string[] = []) {
  const stored = readJson<string[]>(ENROLLMENT_KEY, []);
  const merged = Array.from(new Set([...defaultCourseIds, ...stored]));
  return merged;
}

export function enrollCourse(courseId: string) {
  const ids = getEnrolledCourseIds();
  if (!ids.includes(courseId)) {
    ids.push(courseId);
    writeJson(ENROLLMENT_KEY, ids);
  }
  return ids;
}

export function getStoredQuizAttempts() {
  return readJson<StoredQuizAttempt[]>(QUIZ_ATTEMPTS_KEY, []);
}

export function saveQuizAttempt(attempt: Omit<StoredQuizAttempt, "id" | "submittedAt">) {
  const attempts = getStoredQuizAttempts();
  const stored: StoredQuizAttempt = {
    ...attempt,
    id: `attempt-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  writeJson(QUIZ_ATTEMPTS_KEY, [stored, ...attempts]);
  return stored;
}

export function getLatestQuizAttempt(quizId: string) {
  return getStoredQuizAttempts().find((attempt) => attempt.quizId === quizId) ?? null;
}

export function getCourseProgress(course: Course, lessons: LearningLesson[]): CourseProgressSummary {
  const all = getStoredProgress();
  const courseRecords = lessons
    .map((lesson) => all[progressKey(course.id, lesson.id)])
    .filter(Boolean);

  const completedLessons = courseRecords.filter((record) => record.isCompleted).length;
  const watchTimeSec = courseRecords.reduce((sum, record) => sum + Math.min(record.watchTime, record.durationSec), 0);
  const percent = lessons.length === 0 ? 0 : Math.round((completedLessons / lessons.length) * 100);

  const latest = [...courseRecords].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
  const nextIncomplete = lessons.find((lesson) => !all[progressKey(course.id, lesson.id)]?.isCompleted);

  return {
    courseId: course.id,
    totalLessons: lessons.length,
    completedLessons,
    percent,
    watchTimeSec,
    latestLessonId: nextIncomplete?.id ?? latest?.lessonId ?? lessons[0]?.id ?? "lesson-1",
  };
}
