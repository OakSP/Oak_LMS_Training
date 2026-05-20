import type { BilingualText } from "./i18n";

export type CourseLang = "en" | "zh" | "ja";
export type CourseBadge = "bestseller" | "new" | null;

export interface CourseChapter {
  th: string;
  en: string;
  lessons: number;
  dur: string;
}

export interface Course {
  id: string;
  lang: CourseLang;
  title: BilingualText;
  teacher: string;
  teacherRole: BilingualText;
  level: string;
  hours: number;
  lessons: number;
  enrolled: number;
  rating: number;
  ratings: number;
  price: number;
  oldPrice: number | null;
  tags: { th: string[]; en: string[] };
  badge: CourseBadge;
  desc: BilingualText;
  learn: { th: string[]; en: string[] };
  chapters: CourseChapter[];
}

export interface LearningPath {
  id: string;
  lang: CourseLang;
  title: BilingualText;
  duration: BilingualText;
  desc: BilingualText;
  enrolled: number;
}

export interface Instructor {
  name: string;
  lang: CourseLang;
  role: BilingualText;
  students: number;
  courses: number;
  rating: number;
}

export interface LangMeta {
  code: string;
  th: string;
  en: string;
  glyph: string;
  glyphLong: string;
  color: string;
  swatch: string;
  scriptClass?: string;
}
