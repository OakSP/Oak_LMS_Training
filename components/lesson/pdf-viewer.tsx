import { Icon } from "@/components/shared/icon";
import type { LearningLesson } from "@/types/learning";

interface PdfViewerProps {
  lesson: LearningLesson;
}

export function PdfViewer({ lesson }: PdfViewerProps) {
  return (
    <div style={{
      border: "1px solid var(--line)",
      borderRadius: 16,
      background: "var(--card)",
      overflow: "hidden",
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        borderBottom: "1px solid var(--line)",
        background: "var(--bg-2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, color: "var(--ink)" }}>
          <Icon name="book" size={17} />
          PDF Lesson
        </div>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>{lesson.contentUrl ?? "demo document"}</span>
      </div>
      <div style={{ padding: 28, display: "grid", gap: 18, background: "var(--bg-2)" }}>
        {[1, 2].map((page) => (
          <div key={page} style={{
            maxWidth: 720,
            minHeight: 420,
            margin: "0 auto",
            width: "100%",
            borderRadius: 10,
            background: "var(--card)",
            border: "1px solid var(--line)",
            padding: 36,
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 24 }}>Page {page}</div>
            <h3 style={{ margin: "0 0 16px", fontSize: 22, color: "var(--ink)" }}>{lesson.title.th}</h3>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.8 }}>
              เอกสารประกอบบทเรียนนี้เป็นตัวอย่างสำหรับ MVP preview สามารถเชื่อมต่อ Cloudflare R2 เพื่อแสดงไฟล์ PDF จริงในขั้นตอนถัดไป
            </p>
            <div style={{ display: "grid", gap: 10, marginTop: 28 }}>
              {[70, 92, 58, 84, 76].map((width, index) => (
                <div key={index} style={{ height: 10, width: `${width}%`, background: "var(--line-2)", borderRadius: 99 }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
