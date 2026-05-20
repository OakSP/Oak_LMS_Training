import { z } from "zod";

export const quizAnswerSchema = z.object({
  questionId: z.string(),
  selectedIndex: z.number().int().min(0),
});

export const submitQuizSchema = z.object({
  answers: z.array(quizAnswerSchema).min(1, "At least one answer is required"),
});

export const createQuizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  passPercent: z.coerce.number().min(1).max(100).default(70),
  timeLimitSec: z.coerce.number().min(60).optional(),
  maxAttempts: z.coerce.number().min(1).max(10).default(3),
  lessonId: z.string().cuid(),
});

export const createQuestionSchema = z.object({
  type: z.enum(["multiple_choice", "true_false"]),
  text: z.string().min(5, "Question text must be at least 5 characters"),
  options: z.array(z.string()).min(2, "At least 2 options required"),
  correctIndex: z.coerce.number().int().min(0),
});

export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
