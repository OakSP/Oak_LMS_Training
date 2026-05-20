"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

const inputCls =
  "w-full rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] px-4 py-2.5 text-sm text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-primary)] transition-colors";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"profile" | "password" | "notifications">("profile");
  const [name, setName] = useState(session?.user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    // In production, call PATCH /api/users/me
    await new Promise((r) => setTimeout(r, 500));
    setMessage("Profile saved! (Demo mode — not persisted without DB)");
    setSaving(false);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      setMessage("New passwords do not match.");
      return;
    }
    setSaving(true);
    setMessage("");
    await new Promise((r) => setTimeout(r, 500));
    setMessage("Password changed! (Demo mode)");
    setPasswords({ current: "", next: "", confirm: "" });
    setSaving(false);
  }

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "password", label: "Password" },
    { id: "notifications", label: "Notifications" },
  ] as const;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[color:var(--color-ink)] mb-6">Account Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[color:var(--color-line)]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setMessage(""); }}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? "border-[color:var(--color-primary)] text-[color:var(--color-primary)]"
                : "border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {message && (
        <div className="mb-4 rounded-xl border border-[color:var(--color-success)]/20 bg-[color:var(--color-success)]/5 p-3 text-sm text-[color:var(--color-success)]">
          {message}
        </div>
      )}

      {/* Profile tab */}
      {tab === "profile" && (
        <form onSubmit={saveProfile} className="space-y-5">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-16 w-16 rounded-2xl bg-[color:var(--color-primary)] flex items-center justify-center text-2xl font-bold text-white">
              {(name || session?.user?.name || "?")[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-[color:var(--color-ink)]">{session?.user?.email}</p>
              <p className="text-xs text-[color:var(--color-muted)] capitalize">{(session?.user as { role?: string })?.role ?? "student"}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--color-ink)] mb-1.5">Full Name</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--color-ink)] mb-1.5">Email</label>
            <input className={inputCls} value={session?.user?.email ?? ""} disabled style={{ opacity: 0.6 }} />
            <p className="mt-1 text-xs text-[color:var(--color-muted)]">Email cannot be changed after registration.</p>
          </div>

          <button type="submit" disabled={saving}
            className="rounded-xl bg-[color:var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[color:var(--color-primary-2)] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      )}

      {/* Password tab */}
      {tab === "password" && (
        <form onSubmit={changePassword} className="space-y-5">
          {["current", "next", "confirm"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-[color:var(--color-ink)] mb-1.5 capitalize">
                {field === "next" ? "New Password" : field === "confirm" ? "Confirm New Password" : "Current Password"}
              </label>
              <input
                type="password" className={inputCls}
                value={passwords[field as keyof typeof passwords]}
                onChange={(e) => setPasswords((p) => ({ ...p, [field]: e.target.value }))}
                placeholder="••••••••" minLength={8}
                required
              />
            </div>
          ))}
          <button type="submit" disabled={saving}
            className="rounded-xl bg-[color:var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[color:var(--color-primary-2)] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Change Password"}
          </button>
        </form>
      )}

      {/* Notifications tab */}
      {tab === "notifications" && (
        <div className="space-y-4">
          {[
            { id: "email_enroll", label: "Enrollment confirmations", sub: "Receive email when you enroll in a course" },
            { id: "email_cert", label: "Certificate issued", sub: "Receive email when your certificate is ready" },
            { id: "email_announce", label: "Course announcements", sub: "Receive instructor announcements for enrolled courses" },
          ].map((n) => (
            <label key={n.id} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox" defaultChecked
                className="mt-0.5 h-4 w-4 accent-[color:var(--color-primary)] shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-[color:var(--color-ink)]">{n.label}</p>
                <p className="text-xs text-[color:var(--color-muted)]">{n.sub}</p>
              </div>
            </label>
          ))}
          <button
            className="mt-2 rounded-xl bg-[color:var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[color:var(--color-primary-2)] transition-colors"
            onClick={() => setMessage("Notification preferences saved! (Demo mode)")}
          >
            Save Preferences
          </button>
        </div>
      )}
    </div>
  );
}
