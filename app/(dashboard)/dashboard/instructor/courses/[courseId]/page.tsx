"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const LANGS = [
  { value: "en", label: "English 🇬🇧" },
  { value: "th", label: "Thai 🇹🇭" },
  { value: "zh", label: "Chinese 🇨🇳" },
  { value: "ja", label: "Japanese 🇯🇵" },
];

const inputCls =
  "w-full rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] px-4 py-2.5 text-sm text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-primary)] transition-colors";

interface CourseForm {
  title: string;
  description: string;
  lang: string;
  price: string;
  isFree: boolean;
  isPublished: boolean;
}

export default function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  const [form, setForm] = useState<CourseForm>({
    title: "", description: "", lang: "en",
    price: "0", isFree: true, isPublished: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (res.ok) {
          const data = await res.json();
          const c = data.data ?? data;
          setForm({
            title: c.title ?? "",
            description: c.description ?? "",
            lang: c.lang ?? "en",
            price: String(c.price ?? 0),
            isFree: c.isFree ?? c.is_free ?? false,
            isPublished: c.isPublished ?? c.is_published ?? false,
          });
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) || 0 }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to save");
        return;
      }
      setSuccess("Course saved!");
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    setError("");
    try {
      const res = await fetch(`/api/courses/${courseId}/publish`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, isPublished: data.data?.isPublished ?? !prev.isPublished }));
        setSuccess(form.isPublished ? "Course unpublished." : "Course published!");
      }
    } catch {
      setError("Failed to toggle publish state.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this course? This cannot be undone.")) return;

    const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/instructor/courses");
      router.refresh();
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded-lg bg-[color:var(--color-line)]" />
          <div className="h-48 rounded-2xl bg-[color:var(--color-line)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/instructor/courses" className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]">
          ← My Courses
        </Link>
        <span className="text-[color:var(--color-line)]">/</span>
        <span className="text-sm font-medium text-[color:var(--color-ink)] truncate max-w-[200px]">{form.title || "Edit Course"}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[color:var(--color-ink)]">Edit Course</h1>
        <div className="flex gap-2">
          <button
            onClick={handlePublish}
            disabled={publishing}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              form.isPublished
                ? "border border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:bg-[color:var(--color-line-2)]"
                : "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)] border border-[color:var(--color-success)]/20 hover:bg-[color:var(--color-success)]/20"
            }`}
          >
            {publishing ? "..." : form.isPublished ? "Unpublish" : "Publish"}
          </button>
          <Link
            href={`/dashboard/instructor/courses/${courseId}/lessons`}
            className="rounded-xl border border-[color:var(--color-line)] px-4 py-2 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-line-2)] transition-colors"
          >
            Manage Lessons
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-[color:var(--color-danger)]/20 bg-[color:var(--color-danger)]/5 p-4 text-sm text-[color:var(--color-danger)]">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-[color:var(--color-success)]/20 bg-[color:var(--color-success)]/5 p-4 text-sm text-[color:var(--color-success)]">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[color:var(--color-ink)] mb-1.5">Course Title *</label>
          <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} required minLength={5} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--color-ink)] mb-1.5">Description</label>
          <textarea
            className={`${inputCls} min-h-[120px] resize-y`}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[color:var(--color-ink)] mb-1.5">Language</label>
            <select className={inputCls} value={form.lang} onChange={(e) => set("lang", e.target.value)}>
              {LANGS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--color-ink)] mb-1.5">Price (THB)</label>
            <input
              className={inputCls} type="number" min="0" step="10"
              value={form.price} onChange={(e) => { set("price", e.target.value); set("isFree", parseFloat(e.target.value) === 0); }}
              disabled={form.isFree}
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox" checked={form.isFree}
            onChange={(e) => { set("isFree", e.target.checked); if (e.target.checked) set("price", "0"); }}
            className="h-4 w-4 rounded accent-[color:var(--color-primary)]"
          />
          <span className="text-sm text-[color:var(--color-ink)]">Free course</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 rounded-xl bg-[color:var(--color-primary)] py-2.5 text-sm font-semibold text-white hover:bg-[color:var(--color-primary-2)] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={handleDelete}
            className="rounded-xl border border-[color:var(--color-danger)]/30 px-4 py-2.5 text-sm font-medium text-[color:var(--color-danger)] hover:bg-[color:var(--color-danger)]/5 transition-colors"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
