"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface QuestionDraft {
  type: "multiple_choice" | "true_false";
  text: string;
  options: string[];
  correctIndex: number;
}

const inputCls =
  "w-full rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] px-4 py-2.5 text-sm text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-primary)] transition-colors";

function blank(): QuestionDraft {
  return { type: "multiple_choice", text: "", options: ["", "", "", ""], correctIndex: 0 };
}

export default function QuizBuilderPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [passPercent, setPassPercent] = useState(70);
  const [timeLimitSec, setTimeLimitSec] = useState<number | "">("");
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [questions, setQuestions] = useState<QuestionDraft[]>([blank()]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function addQuestion() {
    setQuestions((prev) => [...prev, blank()]);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateQuestion(index: number, patch: Partial<QuestionDraft>) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...patch } : q))
    );
  }

  function setOption(qIndex: number, oIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const opts = [...q.options];
        opts[oIndex] = value;
        return { ...q, options: opts };
      })
    );
  }

  function setTrueFalse(qIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, type: "true_false", options: ["ถูก", "ผิด"], correctIndex: 0 }
          : q
      )
    );
  }

  function setMultipleChoice(qIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, type: "multiple_choice", options: ["", "", "", ""], correctIndex: 0 }
          : q
      )
    );
  }

  async function handleSave() {
    if (!title.trim()) { setMessage("กรุณากรอกชื่อ Quiz"); return; }
    const incomplete = questions.findIndex(
      (q) => !q.text.trim() || q.options.some((o) => !o.trim())
    );
    if (incomplete !== -1) {
      setMessage(`คำถามข้อ ${incomplete + 1} ยังไม่สมบูรณ์`);
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const payload = {
        title: title.trim(),
        passPercent,
        timeLimitSec: timeLimitSec === "" ? undefined : Number(timeLimitSec),
        maxAttempts,
        lessonId,
        questions,
      };

      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json() as { message?: string; data?: { id: string } };

      if (!res.ok) {
        setMessage("เกิดข้อผิดพลาด กรุณาลองใหม่");
        return;
      }

      const notice = data.message?.includes("Demo") ? " (Demo Mode)" : "";
      setMessage(`✅ สร้าง Quiz สำเร็จ${notice}`);

      setTimeout(() => {
        router.push(`/dashboard/instructor/courses/${courseId}/lessons`);
      }, 1500);
    } catch {
      setMessage("Network error กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm">
        <Link href={`/dashboard/instructor/courses/${courseId}`} className="text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]">
          Edit Course
        </Link>
        <span className="text-[color:var(--color-line)]">/</span>
        <Link href={`/dashboard/instructor/courses/${courseId}/lessons`} className="text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]">
          Lessons
        </Link>
        <span className="text-[color:var(--color-line)]">/</span>
        <span className="font-medium text-[color:var(--color-ink)]">Quiz Builder</span>
      </div>

      <h1 className="text-2xl font-bold text-[color:var(--color-ink)] mb-6">สร้าง Quiz</h1>

      {/* Quiz Settings */}
      <section className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-5 mb-6 space-y-4">
        <h2 className="text-sm font-semibold text-[color:var(--color-ink)]">ตั้งค่า Quiz</h2>

        <div>
          <label className="block text-xs font-medium text-[color:var(--color-muted)] mb-1">ชื่อ Quiz *</label>
          <input className={inputCls} placeholder="เช่น แบบทดสอบบทที่ 1" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-[color:var(--color-muted)] mb-1">คะแนนผ่าน (%)</label>
            <input className={inputCls} type="number" min={1} max={100} value={passPercent}
              onChange={(e) => setPassPercent(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[color:var(--color-muted)] mb-1">เวลาจำกัด (วินาที)</label>
            <input className={inputCls} type="number" min={60} placeholder="ไม่จำกัด" value={timeLimitSec}
              onChange={(e) => setTimeLimitSec(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[color:var(--color-muted)] mb-1">ทำได้สูงสุด (ครั้ง)</label>
            <input className={inputCls} type="number" min={1} max={10} value={maxAttempts}
              onChange={(e) => setMaxAttempts(Number(e.target.value))} />
          </div>
        </div>
      </section>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {questions.map((q, qi) => (
          <section key={qi} className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[color:var(--color-ink)]">คำถามข้อ {qi + 1}</span>
              <div className="flex items-center gap-2">
                {/* Type toggle */}
                <div className="flex rounded-lg border border-[color:var(--color-line)] overflow-hidden text-xs">
                  <button
                    onClick={() => setMultipleChoice(qi)}
                    className={`px-3 py-1.5 transition-colors ${q.type === "multiple_choice" ? "bg-[color:var(--color-primary)] text-white font-semibold" : "text-[color:var(--color-muted)] hover:bg-[color:var(--color-line-2)]"}`}
                  >
                    หลายตัวเลือก
                  </button>
                  <button
                    onClick={() => setTrueFalse(qi)}
                    className={`px-3 py-1.5 transition-colors ${q.type === "true_false" ? "bg-[color:var(--color-primary)] text-white font-semibold" : "text-[color:var(--color-muted)] hover:bg-[color:var(--color-line-2)]"}`}
                  >
                    ถูก/ผิด
                  </button>
                </div>
                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(qi)} className="rounded-lg px-2 py-1.5 text-xs text-[color:var(--color-danger)] hover:bg-[color:var(--color-danger)]/10 transition-colors">
                    ลบ
                  </button>
                )}
              </div>
            </div>

            <input
              className={inputCls}
              placeholder="ข้อความคำถาม..."
              value={q.text}
              onChange={(e) => updateQuestion(qi, { text: e.target.value })}
            />

            <div className="space-y-2">
              <p className="text-xs text-[color:var(--color-muted)]">ตัวเลือก (เลือกข้อที่ถูกต้อง)</p>
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={q.correctIndex === oi}
                    onChange={() => updateQuestion(qi, { correctIndex: oi })}
                    className="h-4 w-4 accent-[color:var(--color-primary)] shrink-0"
                  />
                  <input
                    className={`${inputCls} ${q.correctIndex === oi ? "border-[color:var(--color-success)]" : ""}`}
                    placeholder={`ตัวเลือก ${oi + 1}`}
                    value={opt}
                    disabled={q.type === "true_false"}
                    onChange={(e) => setOption(qi, oi, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Add question button */}
      <button
        onClick={addQuestion}
        className="w-full rounded-2xl border-2 border-dashed border-[color:var(--color-line)] py-3 text-sm text-[color:var(--color-muted)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] transition-colors mb-6"
      >
        + เพิ่มคำถาม
      </button>

      {/* Message */}
      {message && (
        <div className={`mb-4 rounded-xl border p-3 text-sm ${message.startsWith("✅") ? "border-[color:var(--color-success)]/20 bg-[color:var(--color-success)]/5 text-[color:var(--color-success)]" : "border-[color:var(--color-danger)]/20 bg-[color:var(--color-danger)]/5 text-[color:var(--color-danger)]"}`}>
          {message}
        </div>
      )}

      {/* Save */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 rounded-xl bg-[color:var(--color-primary)] py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-[color:var(--color-primary-2)] transition-colors"
        >
          {saving ? "กำลังบันทึก..." : "บันทึก Quiz"}
        </button>
        <Link
          href={`/dashboard/instructor/courses/${courseId}/lessons`}
          className="rounded-xl border border-[color:var(--color-line)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-line-2)] transition-colors"
        >
          ยกเลิก
        </Link>
      </div>
    </div>
  );
}
