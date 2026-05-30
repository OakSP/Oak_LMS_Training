import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(120),
  description: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().min(20, "Description must be at least 20 characters").optional()
  ),
  lang: z.enum(["en", "th", "zh", "ja"]).default("en"),
  price: z.coerce.number().min(0, "Price cannot be negative").default(0),
  isFree: z.boolean().default(false),
  categoryId: z.string().cuid().optional(),
  coverUrl: z.string().url("Invalid cover image URL").optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createLessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  type: z.enum(["video", "pdf", "text", "quiz", "youtube"]).default("video"),
  contentUrl: z.string().url("Invalid content URL").optional(),
  durationSec: z.coerce.number().min(0).optional(),
  isFree: z.boolean().default(false),
  position: z.coerce.number().min(0).default(0),
});

export const reorderLessonsSchema = z.object({
  orderedIds: z.array(z.string().cuid()).min(1),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type ReorderLessonsInput = z.infer<typeof reorderLessonsSchema>;
