"use client";
import { COURSES } from "@/mock/courses";
import { Icon } from "@/components/shared/icon";

export default function AdminDashboard() {
  const stats = [
    { label: "ผู้ใช้งานทั้งหมด",   value: "1,248", icon: "users",     color: "var(--primary)" },
    { label: "คอร์สทั้งหมด",       value: "24",    icon: "book",      color: "var(--accent)" },
    { label: "รายได้รวม",          value: "฿380K", icon: "cert",      color: "var(--success)" },
    { label: "Active ผู้เรียน/เดือน", value: "842",  icon: "dashboard", color: "var(--lang-ja)" },
  ];

  return (
    <div style={{ padding: 36 }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, color: "var(--ink)" }}>Admin Dashboard</h1>
      <p style={{ margin: "0 0 36px", fontSize: 14, color: "var(--muted)" }}>ภาพรวมระบบ Oak LMS</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: 20 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: `${s.color}18`,
              display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: 14,
            }}>
              <Icon name={s.icon} size={18} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.02em" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recent courses */}
        <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>คอร์สล่าสุด</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {COURSES.slice(0, 4).map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13.5 }}>
                <span style={{ color: "var(--ink)", fontWeight: 500 }}>{c.title.th}</span>
                <span style={{ color: "var(--success)", fontSize: 12, fontWeight: 600 }}>Published</span>
              </div>
            ))}
          </div>
        </div>

        {/* System health */}
        <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: 24 }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>สถานะระบบ</h3>
          {[
            { label: "API Response (p95)", value: "142ms", ok: true },
            { label: "System Uptime",      value: "99.98%", ok: true },
            { label: "Database",           value: "Healthy", ok: true },
            { label: "Video Streaming",    value: "Healthy", ok: true },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--line-2)" : "none" }}>
              <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{item.label}</span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: item.ok ? "var(--success)" : "var(--danger)" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
