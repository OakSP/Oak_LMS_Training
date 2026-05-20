import Link from "next/link";
import { Icon } from "@/components/shared/icon";

interface QuizResultProps {
  score: number;
  passPercent: number;
  isPassed: boolean;
  courseId: string;
  lessonId: string;
}

export function QuizResult({ score, passPercent, isPassed, courseId, lessonId }: QuizResultProps) {
  return (
    <section style={{
      border: "1px solid var(--line)",
      borderRadius: 16,
      background: "var(--card)",
      padding: 24,
      boxShadow: "var(--shadow-sm)",
      display: "grid",
      gap: 16,
    }}>
      <div style={{
        width: 58,
        height: 58,
        borderRadius: 16,
        background: isPassed ? "rgba(47,125,90,.12)" : "rgba(178,58,72,.1)",
        color: isPassed ? "var(--success)" : "var(--danger)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Icon name={isPassed ? "cert" : "clock"} size={26} />
      </div>
      <div>
        <div style={{ fontSize: 44, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.03em", lineHeight: 1 }}>
          {score}%
        </div>
        <h2 style={{ margin: "10px 0 6px", fontSize: 21, color: "var(--ink)" }}>
          {isPassed ? "ผ่าน Quiz แล้วค่ะ" : "ยังไม่ผ่าน Quiz"}
        </h2>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
          เกณฑ์ผ่านอยู่ที่ {passPercent}% {isPassed ? "ระบบบันทึก progress ของบทนี้แล้ว" : "ลองทบทวนบทเรียนแล้วทำใหม่อีกครั้งได้เลย"}
        </p>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href={`/learn/${courseId}/${lessonId}`} style={{
          display: "inline-flex",
          alignItems: "center",
          height: 40,
          padding: "0 14px",
          borderRadius: 10,
          background: "var(--primary)",
          color: "#fff",
          textDecoration: "none",
          fontWeight: 700,
        }}>
          กลับบทเรียน
        </Link>
        <Link href="/dashboard/student" style={{
          display: "inline-flex",
          alignItems: "center",
          height: 40,
          padding: "0 14px",
          borderRadius: 10,
          border: "1px solid var(--line)",
          color: "var(--ink)",
          textDecoration: "none",
          fontWeight: 700,
        }}>
          Dashboard
        </Link>
      </div>
    </section>
  );
}
