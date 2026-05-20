import type { Instructor } from "@/types/course";

export const INSTRUCTORS: Instructor[] = [
  { name: "Anya Saetan",        lang: "en", role: { th: "อดีตล่าม UN · TOEIC 990",         en: "Former UN interpreter · TOEIC 990" }, students: 12420, courses: 4, rating: 4.9 },
  { name: "Wei Lin · 林老师",   lang: "zh", role: { th: "ปริญญาเอกภาษาศาสตร์ ปักกิ่ง",    en: "PhD Linguistics, Beijing" },          students: 8460,  courses: 5, rating: 4.9 },
  { name: "Yuki Sato · 佐藤先生", lang: "ja", role: { th: "ครูสอน JLPT N3-N1 ในโตเกียว",  en: "JLPT N3-N1 instructor, Tokyo" },      students: 6730,  courses: 3, rating: 4.9 },
  { name: "Charlotte Reeves",   lang: "en", role: { th: "อดีตผู้ตรวจข้อสอบ IELTS",        en: "Former IELTS examiner" },             students: 7320,  courses: 3, rating: 4.9 },
];
