import { NextRequest, NextResponse } from "next/server";
import { COURSES } from "@/mock/courses";

type CourseCard = { id: string; title: string; price: number; level: string; hours: number };
type Reply = { text: string; courses?: CourseCard[] };

function match(input: string, keywords: string[]): boolean {
  const q = input.toLowerCase();
  return keywords.some(k => q.includes(k.toLowerCase()));
}

function toCards(courses: typeof COURSES): CourseCard[] {
  return courses.map(c => ({ id: c.id, title: c.title.th, price: c.price, level: c.level, hours: c.hours }));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json() as { message?: string };
  const q = (body.message ?? "").trim();

  let reply: Reply;

  if (match(q, ["สวัสดี", "hello", "hi", "หวัดดี", "ดีจ้า", "เฮ้"])) {
    reply = { text: "สวัสดีค่ะ! หนูชื่อ โอ๊คกี้ ผู้ช่วยของ Oak LMS นะคะ 😊\nมีคำถามเรื่องคอร์สเรียนอะไรถามหนูได้เลยค่ะ!" };

  } else if (match(q, ["คอร์สทั้งหมด", "มีคอร์สอะไร", "คอร์สอะไรบ้าง", "แนะนำคอร์ส", "มีอะไรบ้าง", "คอร์สเรียน"])) {
    reply = {
      text: `ตอนนี้มีคอร์สเรียนทั้งหมด ${COURSES.length} คอร์สค่ะ\nทั้งภาษาอังกฤษ 🇬🇧 ภาษาจีน 🇨🇳 และภาษาญี่ปุ่น 🇯🇵`,
      courses: toCards(COURSES),
    };

  } else if (match(q, ["ราคา", "เท่าไหร่", "ค่าเรียน", "price", "บาท", "ราคาคอร์ส"])) {
    const sorted = [...COURSES].sort((a, b) => a.price - b.price);
    const min = sorted[0].price;
    const max = sorted[sorted.length - 1].price;
    reply = {
      text: `ราคาคอร์สเริ่มต้นที่ ฿${min.toLocaleString()} ถึง ฿${max.toLocaleString()} ค่ะ\nหลายคอร์สมีส่วนลดพิเศษอยู่นะคะ 🎉\nคอร์สราคาประหยัด 3 อันดับแรก:`,
      courses: toCards(sorted.slice(0, 3)),
    };

  } else if (match(q, ["อังกฤษ", "english", "toeic", "ielts", "business english", "en "])) {
    const filtered = COURSES.filter(c => c.lang === "en");
    reply = {
      text: `คอร์สภาษาอังกฤษมีทั้งหมด ${filtered.length} คอร์สค่ะ 🇬🇧\nมีทั้ง TOEIC, IELTS, Business English และ Speaking ค่ะ`,
      courses: toCards(filtered),
    };

  } else if (match(q, ["จีน", "chinese", "mandarin", "hsk", "ฮั่นจื่อ"])) {
    const filtered = COURSES.filter(c => c.lang === "zh");
    reply = filtered.length > 0
      ? { text: `คอร์สภาษาจีนมีทั้งหมด ${filtered.length} คอร์สค่ะ 🇨🇳`, courses: toCards(filtered) }
      : { text: "ตอนนี้คอร์สภาษาจีนกำลังเพิ่มเนื้อหาอยู่ค่ะ คาดว่าจะเปิดเร็วๆ นี้นะคะ 🙏" };

  } else if (match(q, ["ญี่ปุ่น", "japanese", "jlpt", "jn1", "jn2", "jn3", "jn4", "jn5", "hiragana"])) {
    const filtered = COURSES.filter(c => c.lang === "ja");
    reply = filtered.length > 0
      ? { text: `คอร์สภาษาญี่ปุ่นมีทั้งหมด ${filtered.length} คอร์สค่ะ 🇯🇵`, courses: toCards(filtered) }
      : { text: "ตอนนี้คอร์สภาษาญี่ปุ่นกำลังเพิ่มเนื้อหาอยู่ค่ะ คาดว่าจะเปิดเร็วๆ นี้นะคะ 🙏" };

  } else if (match(q, ["สมัคร", "ลงทะเบียน", "เริ่มเรียน", "ซื้อคอร์ส", "enroll", "วิธีสมัคร"])) {
    reply = {
      text: "วิธีสมัครเรียนง่ายมากค่ะ 🎓\n1. กดปุ่ม \"ดูคอร์ส\" เพื่อเลือกคอร์สที่สนใจ\n2. กด \"สมัครเรียน\" ในหน้าคอร์ส\n3. ชำระเงินผ่าน Stripe (บัตรเครดิต/เดบิต)\n4. เข้าเรียนได้ทันทีค่ะ 🚀",
    };

  } else if (match(q, ["ใบประกาศ", "certificate", "ประกาศนียบัตร", "ใบเซอร์", "cert"])) {
    reply = {
      text: "เมื่อเรียนครบทุกบทเรียนและผ่าน Quiz คะแนน 70% ขึ้นไป\nระบบจะออกใบประกาศนียบัตรให้อัตโนมัติเลยค่ะ 📜\nสามารถ Download PDF ได้ทันที แชร์ LinkedIn ได้เลยนะคะ!",
    };

  } else if (match(q, ["จ่ายเงิน", "ชำระเงิน", "payment", "บัตรเครดิต", "บัตรเดบิต", "โอน"])) {
    reply = {
      text: "ชำระเงินได้ผ่าน Stripe ค่ะ รองรับ:\n• บัตรเครดิต/เดบิต (Visa, Mastercard, Amex)\n• PromptPay (เร็วๆ นี้)\nปลอดภัย 100% มี SSL encryption ทุกธุรกรรมนะคะ 🔒",
    };

  } else if (match(q, ["ครู", "อาจารย์", "ผู้สอน", "teacher", "instructor"])) {
    const teachers = [...new Set(COURSES.map(c => c.teacher))];
    reply = {
      text: `ผู้สอนของเรามี ${teachers.length} ท่านค่ะ ได้แก่:\n${teachers.join(", ")}\n\nทุกท่านเป็นผู้เชี่ยวชาญที่มีประสบการณ์จริงนะคะ 👩‍🏫`,
    };

  } else if (match(q, ["quiz", "แบบทดสอบ", "ข้อสอบ", "ทดสอบ"])) {
    reply = {
      text: "ทุกคอร์สมี Quiz ท้ายบทเรียนค่ะ 📝\nมีระบบจับเวลา + แสดงผลคะแนนทันที\nทำผ่าน 70% ถึงจะได้รับใบประกาศนะคะ",
    };

  } else if (match(q, ["onsite", "on-site", "ออนไซต์", "สถานที่เรียน", "เรียนที่ไหน", "ที่ตั้ง", "ที่อยู่", "pim", "ปัญญาภิวัฒน์", "สถาบันการจัดการ", "เรียนสด", "เรียนตรง", "คลาสสด", "ห้องเรียน", "นนทบุรี", "แจ้งวัฒนะ"])) {
    reply = {
      text: "Oak LMS มีคลาสเรียนแบบ On-site ด้วยนะคะ 🏫\n\n📍 สถานที่:\nสถาบันการจัดการปัญญาภิวัฒน์ (PIM)\n85/1 หมู่ 2 ถนนแจ้งวัฒนะ ตำบลบางตลาด\nอำเภอปากเกร็ด จังหวัดนนทบุรี 11120\n\n🚇 การเดินทาง:\n• MRT สายสีชมพู — สถานี PIM ลงตรงหน้าสถาบันเลยค่ะ\n• รถยนต์ — ที่จอดรถในสถาบันมีเพียงพอค่ะ\n• รถสาธารณะ — สาย 356, 166 ผ่านหน้าสถาบัน\n\n🗓️ วันเปิดสอน:\nจันทร์ – ศุกร์  เวลา 09:00 – 18:00 น.\nเสาร์ – อาทิตย์ เวลา 09:00 – 16:00 น.\n\n📞 สอบถามเพิ่มเติม:\nโทร 02-855-0140 ต่อ 3333\nEmail: lms@pim.ac.th\n\nสนใจจองคลาส On-site ได้เลยนะคะ 😊",
    };

  } else if (match(q, ["bestseller", "ยอดนิยม", "ฮิต", "ดีที่สุด", "แนะนำ"])) {
    const popular = COURSES.filter(c => c.badge === "bestseller");
    reply = {
      text: `คอร์ส Bestseller มีทั้งหมด ${popular.length} คอร์สค่ะ ⭐ เรียนแล้วได้รับคะแนนสูงสุดจากผู้เรียนนะคะ`,
      courses: toCards(popular),
    };

  } else {
    // Keyword search in title / tags
    const lower = q.toLowerCase();
    const found = COURSES.filter(c =>
      c.title.th.toLowerCase().includes(lower) ||
      c.title.en.toLowerCase().includes(lower) ||
      c.tags.th.some(t => t.toLowerCase().includes(lower)) ||
      c.tags.en.some(t => t.toLowerCase().includes(lower)) ||
      c.teacher.toLowerCase().includes(lower)
    );

    if (found.length > 0) {
      reply = {
        text: `พบคอร์สที่เกี่ยวกับ "${q}" จำนวน ${found.length} คอร์สค่ะ 🔍`,
        courses: toCards(found),
      };
    } else {
      reply = {
        text: "ขอโทษค่ะ หนูยังไม่เข้าใจคำถามนี้ 😅\nลองถามเกี่ยวกับ:\n• คอร์สทั้งหมดที่มี\n• ราคาคอร์ส\n• คอร์สภาษาอังกฤษ / จีน / ญี่ปุ่น\n• วิธีสมัครเรียน\n• ใบประกาศนียบัตร\n• คอร์ส Bestseller\n• สถานที่เรียน On-site (PIM)",
      };
    }
  }

  return NextResponse.json(reply);
}
