"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, []);

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 46, padding: "0 14px",
    borderRadius: 10, border: "1px solid var(--line)",
    background: "var(--card)", color: "var(--ink)",
    fontSize: 14.5, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    transition: "border-color .15s ease",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "Password reset successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
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
        ตั้งรหัสผ่านใหม่
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 14, color: "var(--muted)" }}>
        กรอกรหัสผ่านใหม่ที่คุณต้องการใช้งาน
      </p>

      {status === "success" ? (
        <div>
          <div style={{
            padding: "14px 16px", borderRadius: 10,
            background: "rgba(47,125,90,.08)", border: "1px solid rgba(47,125,90,.25)",
            color: "var(--success)", fontSize: 14, marginBottom: 20,
          }}>
            {message} กำลังพาไปหน้าเข้าสู่ระบบ...
          </div>
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
              รหัสผ่านใหม่
            </label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required minLength={8} style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "var(--ink)", marginBottom: 6 }}>
              ยืนยันรหัสผ่าน
            </label>
            <input
              type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••" required minLength={8} style={inputStyle}
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
            {status === "loading" ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
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
