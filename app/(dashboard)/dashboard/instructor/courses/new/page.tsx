"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LANGS = [
  { value: "en", label: "English 🇬🇧" },
  { value: "th", label: "Thai 🇹🇭" },
  { value: "zh", label: "Chinese 🇨🇳" },
  { value: "ja", label: "Japanese 🇯🇵" },
];

const inputCls =
  "w-full rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] px-4 py-2.5 text-sm text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-primary)] transition-colors";

export default function NewCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    lang: "en",
    price: "0",
    isFree: true,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price) || 0,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message ?? data.error ?? "Failed to create course");
        return;
      }

      router.push("/dashboard/instructor/courses");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard/instructor/courses"
          className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] transition-colors"
        >
          ← My Courses
        </Link>
        <span className="text-[color:var(--color-line)]">/</span>
        <span className="text-sm font-medium text-[color:var(--color-ink)]">New Course</span>
      </div>

      <h1 className="text-2xl font-bold text-[color:var(--color-ink)] mb-6">Create New Course</h1>

      {error && (
        <div className="mb-4 rounded-xl border border-[color:var(--color-danger)]/20 bg-[color:var(--color-danger)]/5 p-4 text-sm text-[color:var(--color-danger)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[color:var(--color-ink)] mb-1.5">
            Course Title <span className="text-[color:var(--color-danger)]">*</span>
          </label>
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. English for Beginners"
            required
            minLength={5}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--color-ink)] mb-1.5">
            Description
          </label>
          <textarea
            className={`${inputCls} min-h-[120px] resize-y`}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe what students will learn..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[color:var(--color-ink)] mb-1.5">Language</label>
            <select
              className={inputCls}
              value={form.lang}
              onChange={(e) => set("lang", e.target.value)}
            >
              {LANGS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--color-ink)] mb-1.5">Price (THB)</label>
            <input
              className={inputCls}
              type="number"
              min="0"
              step="10"
              value={form.price}
              onChange={(e) => {
                set("price", e.target.value);
                set("isFree", parseFloat(e.target.value) === 0);
              }}
              disabled={form.isFree}
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isFree}
            onChange={(e) => {
              set("isFree", e.target.checked);
              if (e.target.checked) set("price", "0");
            }}
            className="h-4 w-4 rounded border-[color:var(--color-line)] accent-[color:var(--color-primary)]"
          />
          <span className="text-sm text-[color:var(--color-ink)]">This is a free course</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-[color:var(--color-primary)] py-2.5 text-sm font-semibold text-white hover:bg-[color:var(--color-primary-2)] disabled:opacity-50 transition-colors"
          >
            {saving ? "Creating..." : "Create Course"}
          </button>
          <Link
            href="/dashboard/instructor/courses"
            className="rounded-xl border border-[color:var(--color-line)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-line-2)] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
