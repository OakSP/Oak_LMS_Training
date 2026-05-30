"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";

export default function RegisterPage() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 46, padding: "0 14px",
    borderRadius: 10, border: "1px solid var(--line)",
    background: "var(--card)", color: "var(--ink)",
    fontSize: 14.5, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    transition: "border-color .15s ease",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json() as { error?: string; mode?: string };
      if (!res.ok) {
        setError(data.error ?? "เกิดข้อผิดพลาด");
        return;
      }

      if (data.mode === "local-demo") {
        // Demo mode: DB ไม่พร้อม — ไม่สามารถ persist ได้, แจ้ง user และ redirect login
        window.location.href = "/login?notice=registered-demo";
        return;
      }

      // DB mode: auto-login หลังสมัคร
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        window.location.href = "/login?notice=registered";
      } else {
        window.location.href = "/dashboard/student";
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/dashboard/student" });
  }

  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--line)",
      borderRadius: 20, padding: 40, width: "100%", maxWidth: 420,
      boxShadow: "var(--shadow-md)",
    }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, color: "var(--ink)", letterSpacing: "-.02em" }}>
        สมัครสมาชิก
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 14, color: "var(--muted)" }}>
        เริ่มเรียนได้ทันทีหลังสมัคร ฟรีตลอดชีพ
      </p>

      <button onClick={handleGoogle} style={{
        width: "100%", height: 46, borderRadius: 10, border: "1px solid var(--line)",
        background: "var(--card)", color: "var(--ink)", fontSize: 14.5, fontWeight: 500,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20,
      }}>
        <Icon name="globe" size={18} />
        Continue with Google
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span style={{ fontSize: 12, color: "var(--muted-2)" }}>หรือกรอกข้อมูล</span>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      {error && (
        <div style={{
          padding: "10px 14px", borderRadius: 10, background: "rgba(178,58,72,.08)",
          border: "1px solid rgba(178,58,72,.2)", color: "var(--danger)",
          fontSize: 13.5, marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "var(--ink)", marginBottom: 6 }}>ชื่อ-นามสกุล</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อของคุณ" required style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--line)")} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "var(--ink)", marginBottom: 6 }}>อีเมล</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" required style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--line)")} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "var(--ink)", marginBottom: 6 }}>รหัสผ่าน</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="อย่างน้อย 8 ตัวอักษร" required minLength={8} style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--line)")} />
        </div>
        <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>
          การสมัครแสดงว่าคุณยอมรับ{" "}
          <Link href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>ข้อกำหนดการใช้งาน</Link>
          {" "}และ{" "}
          <Link href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>นโยบายความเป็นส่วนตัว</Link>
        </p>

        <button
          type="submit"
          disabled={loading}
          style={{
            height: 48, borderRadius: 12, border: "none",
            background: loading ? "var(--muted-2)" : "var(--accent)", color: "#1a0f00",
            fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: 4,
          }}
        >
          {loading ? "กำลังสมัคร..." : "เริ่มเรียนฟรีเลย"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--muted)" }}>
        มีบัญชีแล้ว?{" "}
        <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>เข้าสู่ระบบ</Link>
      </p>
    </div>
  );
}
