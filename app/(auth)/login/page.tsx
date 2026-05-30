"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { ROLE_HOME, DEMO_PASSWORD } from "@/lib/auth/constants";

const DEMO_ACCOUNTS = [
  { email: "student@oak.local",    role: "Student",    icon: "🎓", home: ROLE_HOME.student },
  { email: "instructor@oak.local", role: "Instructor", icon: "🧑‍🏫", home: ROLE_HOME.instructor },
  { email: "admin@oak.local",      role: "Admin",      icon: "⚙️", home: ROLE_HOME.admin },
  { email: "manager@oak.local",    role: "Manager",    icon: "📊", home: ROLE_HOME.manager },
];

export default function LoginPage() {
  const router = useRouter();
  const [callbackUrl] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("callbackUrl") ?? "";
  });
  const [notice] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("notice") ?? "";
  });

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showDemo, setShowDemo] = useState(false);

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
      const res = await signIn("credentials", {
        email, password, redirect: false,
      });
      if (res?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        // Determine role-based home from the session after sign-in
        // We fetch /api/auth/session to get role, then redirect
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const role = session?.user?.role ?? "student";
        const home = ROLE_HOME[role] ?? "/dashboard/student";

        // If a callbackUrl was set (e.g. user was going to a specific page), respect it
        // but only if it starts with the expected role's section OR is a generic path
        if (callbackUrl && !callbackUrl.startsWith("/login") && !callbackUrl.startsWith("/register")) {
          router.push(callbackUrl);
        } else {
          router.push(home);
        }
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const home = callbackUrl || "/dashboard/student";
    await signIn("google", { callbackUrl: home });
  }

  async function quickLogin(account: typeof DEMO_ACCOUNTS[0]) {
    setShowDemo(false);
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: account.email,
        password: DEMO_PASSWORD,
        redirect: false,
      });
      if (res?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        router.push(account.home);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--line)",
      borderRadius: 20, padding: 40, width: "100%", maxWidth: 420,
      boxShadow: "var(--shadow-md)",
    }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 600, color: "var(--ink)", letterSpacing: "-.02em" }}>
        เข้าสู่ระบบ
      </h1>
      <p style={{ margin: "0 0 24px", fontSize: 14, color: "var(--muted)" }}>
        ยินดีต้อนรับกลับสู่ Oak LMS
      </p>

      {notice === "registered" && (
        <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", color: "var(--success)", fontSize: 13.5, marginBottom: 16 }}>
          ✅ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบด้วย email และรหัสผ่านที่ตั้งไว้
        </div>
      )}
      {notice === "registered-demo" && (
        <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(184,118,58,.08)", border: "1px solid rgba(184,118,58,.3)", color: "var(--accent)", fontSize: 13.5, marginBottom: 16 }}>
          ✅ สมัครสมาชิกสำเร็จ (Demo Mode) — กรุณาใช้ Demo Account ด้านล่างเพื่อทดสอบระบบ
        </div>
      )}

      {/* Google login */}
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
        <span style={{ fontSize: 12, color: "var(--muted-2)" }}>หรือ</span>
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
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)" }}>รหัสผ่าน</label>
            <Link href="/forgot-password" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none" }}>
              ลืมรหัสผ่าน?
            </Link>
          </div>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" required style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            height: 48, borderRadius: 12, border: "none",
            background: loading ? "var(--muted-2)" : "var(--primary)", color: "#fff",
            fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: 4,
            transition: "background .15s ease",
          }}
          onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--primary-2)"; }}
          onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--primary)"; }}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>

      {/* Demo accounts toggle */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => setShowDemo((v) => !v)}
          style={{
            width: "100%", padding: "8px 14px", borderRadius: 10,
            border: "1px dashed var(--line)", background: "var(--line-2)",
            color: "var(--muted)", fontSize: 12.5, cursor: "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          🧪 Demo Accounts {showDemo ? "▲" : "▼"}
        </button>

        {showDemo && (
          <div style={{
            marginTop: 8, borderRadius: 12, border: "1px solid var(--line)",
            background: "var(--line-2)", overflow: "hidden",
          }}>
            <p style={{ padding: "8px 12px 4px", fontSize: 11, color: "var(--muted-2)", fontWeight: 500 }}>
              รหัสผ่านทุก account: <strong>demo1234</strong>
            </p>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                onClick={() => quickLogin(acc)}
                style={{
                  width: "100%", padding: "8px 12px", border: "none",
                  background: "transparent", cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                  borderTop: "1px solid var(--line)", transition: "background .1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{acc.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                    {acc.role}
                  </p>
                  <p style={{ margin: 0, fontSize: 11.5, color: "var(--muted)", fontFamily: "monospace" }}>
                    {acc.email}
                  </p>
                </div>
                <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>เข้าสู่ระบบ →</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--muted)" }}>
        ยังไม่มีบัญชี?{" "}
        <Link href="/register" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
          สมัครสมาชิกฟรี
        </Link>
      </p>
    </div>
  );
}
