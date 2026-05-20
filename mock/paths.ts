import type { LearningPath } from "@/types/course";

export const PATHS: LearningPath[] = [
  {
    id: "path-en-fluency",
    lang: "en",
    title: { th: "เส้นทางพูดอังกฤษคล่อง — A2 ถึง B2", en: "English Fluency Path — A2 to B2" },
    duration: { th: "9 เดือน · 4 คอร์ส", en: "9 months · 4 courses" },
    desc: { th: "จากผู้เริ่มต้นสู่ระดับใช้งานในที่ทำงาน เรียนต่อเนื่องด้วยโครงสร้างของ CEFR", en: "From beginner to workplace level, structured along the CEFR ladder." },
    enrolled: 4210,
  },
  {
    id: "path-zh-hsk",
    lang: "zh",
    title: { th: "เส้นทาง HSK — จาก HSK 1 ถึง HSK 5", en: "HSK Path — HSK 1 to HSK 5" },
    duration: { th: "14 เดือน · 5 คอร์ส", en: "14 months · 5 courses" },
    desc: { th: "ระบบสอบจีนสากล สำหรับเรียนต่อ หรือทำงานในประเทศจีน", en: "The global Chinese benchmark for studying or working in China." },
    enrolled: 2840,
  },
  {
    id: "path-ja-jlpt",
    lang: "ja",
    title: { th: "เส้นทาง JLPT — จาก N5 ถึง N2", en: "JLPT Path — N5 to N2" },
    duration: { th: "16 เดือน · 4 คอร์ส", en: "16 months · 4 courses" },
    desc: { th: "เตรียมพร้อมสอบ JLPT พร้อมใช้งานจริงในชีวิตและการทำงาน", en: "Get JLPT-ready while building real-world fluency." },
    enrolled: 3120,
  },
];
