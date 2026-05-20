"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Icon } from "@/components/shared/icon";
import type { Role } from "@/types/auth";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",     href: "/dashboard/student",    icon: "dashboard", roles: ["student"] },
  { label: "My Courses",    href: "/dashboard/student",    icon: "book",      roles: ["student"] },
  { label: "Certificates",  href: "/dashboard/student",    icon: "cert",      roles: ["student"] },
  { label: "Dashboard",     href: "/dashboard/instructor", icon: "dashboard", roles: ["instructor"] },
  { label: "My Courses",    href: "/dashboard/instructor/courses", icon: "book", roles: ["instructor"] },
  { label: "Analytics",     href: "/dashboard/instructor", icon: "users",     roles: ["instructor"] },
  { label: "Overview",      href: "/dashboard/admin",      icon: "dashboard", roles: ["admin", "super_admin"] },
  { label: "Users",         href: "/dashboard/admin/users", icon: "users",    roles: ["admin", "super_admin"] },
  { label: "Reports",       href: "/dashboard/admin/reports", icon: "book",   roles: ["admin", "super_admin", "manager"] },
  { label: "Settings",      href: "/settings",             icon: "settings",  roles: ["student", "instructor", "admin", "super_admin", "manager"] },
];

interface DashboardSidebarProps {
  role?: Role;
}

export function DashboardSidebar({ role = "student" }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const activeRole = (session?.user?.role as Role | undefined) ?? role;

  const items = NAV_ITEMS.filter((item) => item.roles.includes(activeRole));

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: "var(--card)",
      borderRight: "1px solid var(--line)",
      display: "flex", flexDirection: "column",
      padding: "24px 12px",
      minHeight: "100vh",
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 32, padding: "0 8px" }}>
        <span style={{ color: "var(--primary)", display: "inline-flex" }}><Icon name="logo" size={22} /></span>
        <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-.02em", color: "var(--ink)" }}>
          Oak<span style={{ color: "var(--accent)" }}>.</span>
        </span>
      </Link>

      {/* Nav items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {items.map((item, i) => {
          const active = pathname === item.href;
          return (
            <Link key={i} href={item.href} style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 9,
              fontSize: 14, fontWeight: active ? 600 : 500,
              color: active ? "var(--primary)" : "var(--muted)",
              background: active ? "var(--line-2)" : "transparent",
              textDecoration: "none", transition: "all .15s ease",
            }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--line-2)"; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <Icon name={item.icon} size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/login" })}
        style={{
        display: "inline-flex", alignItems: "center", gap: 12,
        padding: "10px 12px", borderRadius: 9, fontSize: 14, fontWeight: 500,
        color: "var(--danger)", background: "transparent", border: "none",
        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      }}>
        <Icon name="logout" size={17} />
        Sign out
      </button>
    </aside>
  );
}
