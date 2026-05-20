import Link from "next/link";
import { Icon } from "@/components/shared/icon";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", gap: 16, textAlign: "center", padding: 24 }}>
      <span style={{ fontSize: 64, lineHeight: 1 }}>404</span>
      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: "var(--ink)" }}>ไม่พบหน้าที่คุณต้องการ</h1>
      <p style={{ margin: 0, fontSize: 15, color: "var(--muted)" }}>หน้านี้อาจถูกย้ายหรือไม่มีอยู่</p>
      <Link href="/" style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 24px", background: "var(--primary)", color: "#fff",
        borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none", marginTop: 8,
      }}>
        <Icon name="arrow" size={16} />
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
