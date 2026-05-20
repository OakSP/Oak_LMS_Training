"use client";
import { useLang } from "@/hooks/use-lang";
import { Icon } from "@/components/shared/icon";
import Link from "next/link";

export function Footer() {
  const { lang, t } = useLang();

  const cols = [
    {
      title: lang === "en" ? "Company" : "บริษัท",
      items: [t("ft_about"), t("nav_biz"), t("ft_inst"), "Blog"],
    },
    {
      title: lang === "en" ? "Languages" : "ภาษา",
      items: ["English", "中文", "日本語", "한국어"],
    },
    {
      title: lang === "en" ? "Support" : "ช่วยเหลือ",
      items: [t("ft_help"), "FAQ", "Contact", lang === "en" ? "Refund policy" : "นโยบายคืนเงิน"],
    },
    {
      title: lang === "en" ? "Legal" : "ข้อกำหนด",
      items: [t("ft_terms"), t("ft_priv"), "Cookies"],
    },
  ];

  return (
    <footer style={{ marginTop: 100, background: "var(--primary)", color: "rgba(242,244,248,.75)" }}>
      <div className="wrap" style={{ padding: "70px 32px 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 50 }}>
          {/* Brand column */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ color: "#F2F4F8", display: "inline-flex" }}><Icon name="logo" size={28} /></span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#F2F4F8", letterSpacing: "-.02em" }}>
                Oak<span style={{ color: "var(--accent)" }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, maxWidth: 320, margin: "0 0 22px 0", opacity: .8 }}>
              {lang === "en"
                ? "Premium language learning for ambitious people. Built in Bangkok, taught by the world."
                : "การเรียนภาษาคุณภาพสูง สำหรับคนที่อยากเก่งจริง สร้างจากกรุงเทพฯ สอนโดยครูระดับโลก"}
            </p>
            <div style={{ display: "flex", gap: 18, fontSize: 13.5 }}>
              <span><strong style={{ color: "#F2F4F8", fontSize: 18 }}>320K+</strong><br /><span style={{ opacity: .6 }}>{t("hero_stat_1")}</span></span>
              <span style={{ width: 1, background: "rgba(255,255,255,.15)" }} />
              <span><strong style={{ color: "#F2F4F8", fontSize: 18 }}>4.8</strong><br /><span style={{ opacity: .6 }}>★ {lang === "en" ? "average" : "เฉลี่ย"}</span></span>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#F2F4F8", marginBottom: 16, opacity: .9 }}>
                {col.title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.items.map((item, j) => (
                  <li key={j}>
                    <Link href="#" style={{ fontSize: 13.5, opacity: .7, textDecoration: "none", color: "inherit", transition: "opacity .15s ease" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = ".7")}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.12)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, opacity: .6 }}>
          <span>{t("ft_rights")}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="globe" size={13} />
            {lang === "en" ? "Bangkok · Available worldwide" : "กรุงเทพฯ · พร้อมให้บริการทั่วโลก"}
          </span>
        </div>
      </div>
    </footer>
  );
}
