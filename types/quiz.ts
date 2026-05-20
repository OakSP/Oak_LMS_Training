export type QuestionType = "multiple_choice" | "true_false";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  passPercent: number;
  timeLimitSec: number | null;
  maxAttempts: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  isPassed: boolean;
  startedAt: Date;
  submittedAt: Date;
}
