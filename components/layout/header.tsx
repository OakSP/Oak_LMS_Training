"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useLang } from "@/hooks/use-lang";
import { useTheme } from "@/hooks/use-theme";
import { Icon } from "@/components/shared/icon";

export function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const { lang, setLang, t } = useLang();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function goSearch() {
    const q = query.trim();
    router.push(q ? `/courses?q=${encodeURIComponent(q)}` : "/courses");
  }

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: scrolled ? "color-mix(in srgb,var(--bg) 92%,transparent)" : "transparent",
      backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
      borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      transition: "all .25s ease",
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 24, height: 70 }}>

        {/* Logo */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, flexShrink: 0, textDecoration: "none" }}>
          <span style={{ color: "var(--primary)", display: "inline-flex" }}>
            <Icon name="logo" size={26} />
          </span>
          <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-.02em", color: "var(--ink)" }}>
            Oak<span style={{ color: "var(--accent)" }}>.</span>
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 4, alignItems: "center", fontSize: 14, fontWeight: 500 }}>
          {[
            { label: t("nav_explore"), href: "/courses" },
            { label: t("nav_paths"), href: "/courses" },
            { label: t("nav_biz"), href: "/" },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{
              padding: "8px 12px", borderRadius: 8, color: "var(--muted)",
              textDecoration: "none", transition: "color .15s ease",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--ink)"; (e.currentTarget as HTMLElement).style.background = "var(--line-2)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 460, marginLeft: "auto", position: "relative" }}>
          <Icon name="search" size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goSearch();
            }}
            placeholder={t("search_ph")}
            style={{
              width: "100%", height: 42, paddingLeft: 40, paddingRight: 14,
              borderRadius: 10, border: "1px solid var(--line)",
              background: "var(--card)", color: "var(--ink)",
              fontSize: 13.5, fontFamily: "inherit",
              outline: "none", transition: "border-color .15s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
          />
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === "th" ? "en" : "th")}
            style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--card)", color: "var(--muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            {lang === "th" ? "EN" : "TH"}
          </button>

          {/* Theme toggle */}
          <button onClick={toggle} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", color: "var(--muted)", cursor: "pointer" }}>
            <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
          </button>

          {session?.user ? (
            <>
              <Link href={`/dashboard/${session.user.role === "instructor" ? "instructor" : session.user.role === "admin" || session.user.role === "super_admin" ? "admin" : "student"}`} style={{ fontSize: 13.5, fontWeight: 600, color: "var(--muted)", padding: "0 8px", textDecoration: "none" }}>
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => void signOut({ callbackUrl: "/login" })}
                style={{
                  display: "inline-flex", alignItems: "center", height: 38, padding: "0 14px",
                  background: "var(--line-2)", color: "var(--ink)", borderRadius: 9,
                  border: "1px solid var(--line)", fontSize: 13.5, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: 13.5, fontWeight: 500, color: "var(--muted)", padding: "0 8px", textDecoration: "none" }}>
                {t("nav_login")}
              </Link>
              <Link href="/register" style={{
                display: "inline-flex", alignItems: "center", height: 38, padding: "0 18px",
                background: "var(--primary)", color: "#fff", borderRadius: 9,
                fontSize: 13.5, fontWeight: 600, textDecoration: "none",
                transition: "background .15s ease",
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--primary-2)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--primary)")}>
                {t("nav_signup")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
