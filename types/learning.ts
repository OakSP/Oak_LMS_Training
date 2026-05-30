import type { BilingualText } from "./i18n";

export type LessonContentType = "video" | "pdf" | "text" | "quiz" | "youtube";

export interface LessonResource {
  id: string;
  title: string;
  kind: "pdf" | "worksheet" | "transcript";
  sizeLabel: string;
}

export interface LearningLesson {
  id: string;
  courseId: string;
  title: BilingualText;
  chapterTitle: BilingualText;
  description: BilingualText;
  type: LessonContentType;
  durationSec: number;
  position: number;
  isFree: boolean;
  contentUrl?: string;
  resources: LessonResource[];
}

export interface StoredLessonProgress {
  courseId: string;
  lessonId: string;
  watchTime: number;
  durationSec: number;
  isCompleted: boolean;
  completedAt: string | null;
  updatedAt: string;
}

export interface CourseProgressSummary {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percent: number;
  watchTimeSec: number;
  latestLessonId: string;
}
