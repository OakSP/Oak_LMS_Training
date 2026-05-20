"use client";
import { COURSES } from "@/mock/courses";
import { Icon } from "@/components/shared/icon";
import Link from "next/link";

export default function InstructorDashboard() {
  const myCourses = COURSES.slice(0, 2);

  const stats = [
    { label: "คอร์สทั้งหมด",     value: "2",     icon: "book",  color: "var(--primary)" },
    { label: "ผู้เรียนทั้งหมด",   value: "20,630", icon: "users", color: "var(--accent)" },
    { label: "รายได้เดือนนี้",    value: "฿48,200", icon: "cert", color: "var(--success)" },
    { label: "คะแนนเฉลี่ย",       value: "4.9",   icon: "star",  color: "var(--lang-ja)" },
  ];

  return (
    <div style={{ padding: 36 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, color: "var(--ink)" }}>Instructor Dashboard</h1>
          <p style={{ margin: 0, fontSize: 14, color: "var(--muted)" }}>จัดการคอร์สและติดตามผู้เรียนของคุณ</p>
        </div>
        <Link href="/dashboard/instructor/courses/new" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 20px", background: "var(--primary)", color: "#fff",
          borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none",
        }}>
          <Icon name="book" size={16} />
          สร้างคอร์สใหม่
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: 20 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: `${s.color}18`,
              display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: 14,
            }}>
              <Icon name={s.icon} size={18} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.02em" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>คอร์สของฉัน</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {myCourses.map((course) => (
          <div key={course.id} style={{
            background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 22px",
            display: "flex", alignItems: "center", gap: 20,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>{course.title.th}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                {course.enrolled.toLocaleString()} ผู้เรียน · ⭐ {course.rating}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>฿{course.price.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "var(--success)" }}>Published</div>
            </div>
            <Link href={`/dashboard/instructor/courses/${course.id}`} style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid var(--line)",
              fontSize: 13, fontWeight: 500, color: "var(--muted)", textDecoration: "none",
            }}>
              แก้ไข
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
