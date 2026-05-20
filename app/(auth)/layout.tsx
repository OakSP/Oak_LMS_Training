import Link from "next/link";
import { Icon } from "@/components/shared/icon";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", alignItems: "center", justifyContent: "center" }}>
      <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
        <span style={{ color: "var(--primary)" }}><Icon name="logo" size={28} /></span>
        <span style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.02em" }}>
          Oak<span style={{ color: "var(--accent)" }}>.</span>
        </span>
      </Link>
      {children}
    </div>
  );
}
