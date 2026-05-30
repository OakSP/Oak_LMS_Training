"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enrollCourse } from "@/lib/learning/progress-storage";

interface EnrollButtonProps {
  courseId: string;
  firstLessonId: string;
  price: number;
  isFree: boolean;
  label?: string;
}

export function EnrollButton({ courseId, firstLessonId, price, isFree, label }: EnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEnroll() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });

      if (res.status === 401) {
        router.push(`/login?callbackUrl=/courses/${courseId}`);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
        return;
      }

      // Save to localStorage for demo mode
      enrollCourse(courseId);

      router.push(`/learn/${courseId}/${firstLessonId}`);
    } catch {
      setError("ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <p style={{ color: "var(--danger)", fontSize: 13, marginBottom: 8 }}>{error}</p>
      )}
      <button
        onClick={handleEnroll}
        disabled={loading}
        style={{
          display: "block",
          width: "100%",
          padding: "14px 0",
          textAlign: "center",
          background: loading ? "var(--muted-2)" : "var(--primary)",
          color: "#fff",
          borderRadius: 12,
          fontWeight: 600,
          fontSize: 15,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: 10,
        }}
      >
        {loading ? "กำลังดำเนินการ..." : label ?? (isFree ? "เรียนฟรีเลย" : `ซื้อคอร์ส ฿${price.toLocaleString()}`)}
      </button>
    </div>
  );
}
