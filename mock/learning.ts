import { COURSES } from "@/mock/courses";
import type { Course } from "@/types/course";
import type { LearningLesson, LessonContentType } from "@/types/learning";
import type { Quiz, QuizQuestion } from "@/types/quiz";

const TYPE_PATTERN: LessonContentType[] = ["video", "video", "text", "video", "pdf", "video", "quiz"];

function getLessonType(position: number): LessonContentType {
  return TYPE_PATTERN[(position - 1) % TYPE_PATTERN.length];
}

function buildDescription(course: Course, chapterTitle: { th: string; en: string }, position: number) {
  return {
    th: `บทเรียนที่ ${position} จากคอร์ส ${course.title.th} เน้นฝึก ${chapterTitle.th} ผ่านตัวอย่างใช้งานจริง`,
    en: `Lesson ${position} from ${course.title.en}, focused on ${chapterTitle.en} with practical examples.`,
  };
}

function buildResources(course: Course, position: number) {
  return [
    {
      id: `${course.id}-resource-${position}-summary`,
      title: "Lesson summary",
      kind: "transcript" as const,
      sizeLabel: "12 KB",
    },
    {
      id: `${course.id}-resource-${position}-worksheet`,
      title: "Practice worksheet",
      kind: "worksheet" as const,
      sizeLabel: "180 KB",
    },
  ];
}

function buildLessonsForCourse(course: Course): LearningLesson[] {
  const avgDuration = Math.max(180, Math.round((course.hours * 3600) / Math.max(course.lessons, 1)));
  const lessons: LearningLesson[] = [];
  let position = 1;

  for (const chapter of course.chapters) {
    for (let chapterLesson = 1; chapterLesson <= chapter.lessons; chapterLesson += 1) {
      const type = getLessonType(position);
      lessons.push({
        id: `lesson-${position}`,
        courseId: course.id,
        title: {
          th: `${chapter.th} · ตอนที่ ${chapterLesson}`,
          en: `${chapter.en} · Part ${chapterLesson}`,
        },
        chapterTitle: { th: chapter.th, en: chapter.en },
        description: buildDescription(course, { th: chapter.th, en: chapter.en }, position),
        type,
        durationSec: type === "quiz" ? 600 : avgDuration,
        position,
        isFree: position === 1,
        contentUrl: type === "pdf" ? `/demo/${course.id}/lesson-${position}.pdf` : undefined,
        resources: buildResources(course, position),
      });
      position += 1;
    }
  }

  return lessons;
}

export const LESSONS: LearningLesson[] = COURSES.flatMap(buildLessonsForCourse);

function languageQuestion(course: Course, id: string, text: string, correctIndex: number): QuizQuestion {
  return {
    id,
    type: "multiple_choice",
    text,
    options:
      course.lang === "zh"
        ? ["ออกเสียงและความหมาย", "ราคาและส่วนลด", "ชื่อผู้สอน", "จำนวนรีวิว"]
        : course.lang === "ja"
          ? ["รูปประโยคและบริบท", "ราคาและส่วนลด", "ชื่อผู้สอน", "จำนวนรีวิว"]
          : ["meaning and context", "price and discount", "instructor name", "review count"],
    correctIndex,
  };
}

function buildQuizForLesson(course: Course, lesson: LearningLesson): Quiz {
  const langName = course.lang === "zh" ? "ภาษาจีน" : course.lang === "ja" ? "ภาษาญี่ปุ่น" : "ภาษาอังกฤษ";
  const questions: QuizQuestion[] = [
    languageQuestion(course, `${course.id}-${lesson.id}-q1`, `หัวใจหลักของบท "${lesson.title.th}" คืออะไร`, 0),
    {
      id: `${course.id}-${lesson.id}-q2`,
      type: "true_false",
      text: `คอร์สนี้มีเป้าหมายให้ผู้เรียนนำ ${langName} ไปใช้ในสถานการณ์จริง`,
      options: ["ถูก", "ผิด"],
      correctIndex: 0,
    },
    {
      id: `${course.id}-${lesson.id}-q3`,
      type: "multiple_choice",
      text: "หลังจบบทเรียน ควรทำอะไรต่อเพื่อเก็บ progress ให้ครบ",
      options: ["กดเรียนจบ/ส่งแบบทดสอบ", "ปิด browser ทันที", "ข้ามไปหน้าแรก", "ลบข้อมูล progress"],
      correctIndex: 0,
    },
    {
      id: `${course.id}-${lesson.id}-q4`,
      type: "true_false",
      text: "ระบบจะนับความก้าวหน้าจากบทเรียนและคะแนน Quiz ร่วมกัน",
      options: ["ถูก", "ผิด"],
      correctIndex: 0,
    },
  ];

  return {
    id: `quiz-${course.id}-${lesson.id}`,
    lessonId: lesson.id,
    title: `Quiz: ${lesson.title.th}`,
    passPercent: 70,
    timeLimitSec: 300,
    maxAttempts: 3,
    questions,
  };
}

export const QUIZZES: Quiz[] = LESSONS
  .filter((lesson) => lesson.type === "quiz")
  .map((lesson) => {
    const course = COURSES.find((item) => item.id === lesson.courseId);
    if (!course) throw new Error(`Missing course for lesson ${lesson.id}`);
    return buildQuizForLesson(course, lesson);
  });

export function getCourseById(courseId: string) {
  return COURSES.find((course) => course.id === courseId) ?? null;
}

export function getCourseLessons(courseId: string) {
  return LESSONS.filter((lesson) => lesson.courseId === courseId).sort((a, b) => a.position - b.position);
}

export function getLessonById(courseId: string, lessonId: string) {
  return getCourseLessons(courseId).find((lesson) => lesson.id === lessonId) ?? null;
}

export function getAdjacentLessons(courseId: string, lessonId: string) {
  const lessons = getCourseLessons(courseId);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return {
    previous: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null,
  };
}

export function getQuizById(quizId: string) {
  return QUIZZES.find((quiz) => quiz.id === quizId) ?? null;
}

export function getQuizForLesson(courseId: string, lessonId: string) {
  return QUIZZES.find((quiz) => quiz.id === `quiz-${courseId}-${lessonId}`) ?? null;
}

export function getCourseForQuiz(quizId: string) {
  const quiz = getQuizById(quizId);
  if (!quiz) return { quiz: null, course: null, lesson: null };

  const lesson = LESSONS.find((item) => getQuizForLesson(item.courseId, item.id)?.id === quiz.id) ?? null;
  const course = lesson ? getCourseById(lesson.courseId) : null;
  return { quiz, course, lesson };
}

export function getFirstQuizForCourse(courseId: string) {
  const quizLesson = getCourseLessons(courseId).find((lesson) => lesson.type === "quiz");
  return quizLesson ? getQuizForLesson(courseId, quizLesson.id) : null;
}
