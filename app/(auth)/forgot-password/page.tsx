"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 46, padding: "0 14px",
    borderRadius: 10, border: "1px solid var(--line)",
    background: "var(--card)", color: "var(--ink)",
    fontSize: 14.5, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    transition: "border-color .15s ease",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "Reset link sent! Check your inbox.");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--line)",
      borderRadius: 20, padding: 40, width: "100%", maxWidth: 420,
      boxShadow: "var(--shadow-md)",
    }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, color: "var(--ink)", letterSpacing: "-.02em" }}>
        ลืมรหัสผ่าน
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 14, color: "var(--muted)" }}>
        กรอกอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้
      </p>

      {status === "success" ? (
        <div>
          <div style={{
            padding: "14px 16px", borderRadius: 10,
            background: "rgba(47,125,90,.08)", border: "1px solid rgba(47,125,90,.25)",
            color: "var(--success)", fontSize: 14, marginBottom: 20,
          }}>
            {message}
          </div>
          <Link href="/login" style={{
            display: "block", textAlign: "center", fontSize: 14,
            color: "var(--accent)", textDecoration: "none", fontWeight: 500,
          }}>
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {status === "error" && (
            <div style={{
              padding: "10px 14px", borderRadius: 10,
              background: "rgba(178,58,72,.08)", border: "1px solid rgba(178,58,72,.2)",
              color: "var(--danger)", fontSize: 13.5,
            }}>
              {message}
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "var(--ink)", marginBottom: 6 }}>
              อีเมล
            </label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" required style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              height: 48, borderRadius: 12, border: "none",
              background: status === "loading" ? "var(--muted-2)" : "var(--primary)", color: "#fff",
              fontSize: 15, fontWeight: 600, cursor: status === "loading" ? "not-allowed" : "pointer", marginTop: 4,
            }}
          >
            {status === "loading" ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ต"}
          </button>

          <p style={{ textAlign: "center", fontSize: 14, color: "var(--muted)", margin: 0 }}>
            <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
