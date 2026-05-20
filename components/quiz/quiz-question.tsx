import type { QuizQuestion as QuizQuestionType } from "@/types/quiz";

interface QuizQuestionProps {
  question: QuizQuestionType;
  index: number;
  selectedIndex: number;
  disabled?: boolean;
  onSelect: (index: number) => void;
}

export function QuizQuestion({ question, index, selectedIndex, disabled = false, onSelect }: QuizQuestionProps) {
  return (
    <section style={{
      border: "1px solid var(--line)",
      borderRadius: 14,
      background: "var(--card)",
      padding: 20,
      display: "grid",
      gap: 14,
    }}>
      <div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
          Question {index + 1} · {question.type === "true_false" ? "True/False" : "Multiple choice"}
        </div>
        <h2 style={{ margin: 0, fontSize: 18, lineHeight: 1.45, color: "var(--ink)" }}>{question.text}</h2>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {question.options.map((option, optionIndex) => {
          const selected = selectedIndex === optionIndex;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(optionIndex)}
              style={{
                minHeight: 46,
                width: "100%",
                borderRadius: 10,
                border: selected ? "1px solid var(--primary)" : "1px solid var(--line)",
                background: selected ? "var(--line-2)" : "transparent",
                color: "var(--ink)",
                textAlign: "left",
                padding: "10px 12px",
                font: "inherit",
                cursor: disabled ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{
                width: 24,
                height: 24,
                borderRadius: 999,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: selected ? "var(--primary)" : "var(--line-2)",
                color: selected ? "#fff" : "var(--muted)",
                fontSize: 12,
                fontWeight: 700,
              }}>
                {String.fromCharCode(65 + optionIndex)}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
