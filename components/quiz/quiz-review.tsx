import { Icon } from "@/components/shared/icon";
import type { QuizQuestion } from "@/types/quiz";

interface QuizReviewProps {
  questions: QuizQuestion[];
  answers: number[];
}

export function QuizReview({ questions, answers }: QuizReviewProps) {
  return (
    <section style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: "8px 0 2px", fontSize: 18, color: "var(--ink)" }}>Review answers</h2>
      {questions.map((question, index) => {
        const selected = answers[index];
        const correct = selected === question.correctIndex;

        return (
          <div key={question.id} style={{
            border: "1px solid var(--line)",
            borderRadius: 12,
            background: "var(--card)",
            padding: 16,
            display: "grid",
            gap: 8,
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                background: correct ? "var(--success)" : "var(--danger)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon name={correct ? "check" : "x"} size={14} />
              </span>
              <div>
                <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{question.text}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  คำตอบของคุณ: {selected >= 0 ? question.options[selected] : "ยังไม่ได้ตอบ"}
                </div>
                {!correct && (
                  <div style={{ fontSize: 13, color: "var(--success)", marginTop: 3 }}>
                    คำตอบที่ถูก: {question.options[question.correctIndex]}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
