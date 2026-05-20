"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Lesson {
  id: string;
  title: string;
  type: "video" | "pdf" | "text" | "quiz";
  durationSec: number | null;
  isFree: boolean;
  position: number;
}

const TYPE_ICONS: Record<string, string> = {
  video: "▶",
  pdf: "📄",
  text: "📝",
  quiz: "✏️",
};

function SortableLesson({
  lesson,
  onDelete,
}: {
  lesson: Lesson;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-3 group"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-[color:var(--color-muted-2)] hover:text-[color:var(--color-ink)] shrink-0"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      <span className="w-7 h-7 rounded-lg bg-[color:var(--color-line-2)] flex items-center justify-center text-sm shrink-0">
        {TYPE_ICONS[lesson.type] ?? "•"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[color:var(--color-ink)] truncate">{lesson.title}</p>
        <p className="text-xs text-[color:var(--color-muted)] capitalize">
          {lesson.type}
          {lesson.durationSec ? ` · ${Math.round(lesson.durationSec / 60)} min` : ""}
          {lesson.isFree ? " · Free preview" : ""}
        </p>
      </div>
      <button
        onClick={() => onDelete(lesson.id)}
        className="opacity-0 group-hover:opacity-100 shrink-0 rounded-lg p-1.5 text-[color:var(--color-danger)] hover:bg-[color:var(--color-danger)]/10 transition-all"
        aria-label="Delete lesson"
      >
        ✕
      </button>
    </div>
  );
}

export default function LessonBuilderPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: "", type: "video" as Lesson["type"], isFree: false });
  const [message, setMessage] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/courses/${courseId}/lessons`);
        if (res.ok) {
          const data = await res.json();
          const raw = data.data ?? data ?? [];
          setLessons(
            raw.map((l: Lesson, i: number) => ({ ...l, position: l.position ?? i }))
              .sort((a: Lesson, b: Lesson) => a.position - b.position)
          );
        }
      } catch {
        // use empty
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLessons((prev) => {
      const oldIndex = prev.findIndex((l) => l.id === active.id);
      const newIndex = prev.findIndex((l) => l.id === over.id);
      return arrayMove(prev, oldIndex, newIndex).map((l, i) => ({ ...l, position: i }));
    });
  }

  async function saveOrder() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/courses/${courseId}/lessons/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: lessons.map((l) => l.id) }),
      });
      setMessage(res.ok ? "Order saved!" : "Failed to save order.");
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function addLesson() {
    if (!newLesson.title.trim()) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newLesson, position: lessons.length }),
      });
      const data = await res.json();
      if (res.ok || data.data) {
        const lesson = data.data ?? { id: `demo-${Date.now()}`, ...newLesson, durationSec: null, position: lessons.length };
        setLessons((prev) => [...prev, lesson]);
        setNewLesson({ title: "", type: "video", isFree: false });
        setShowForm(false);
      }
    } catch {
      setMessage("Failed to add lesson.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLesson(id: string) {
    if (!confirm("Delete this lesson?")) return;
    const res = await fetch(`/api/lessons/${id}`, { method: "DELETE" });
    if (res.ok || res.status === 200) {
      setLessons((prev) => prev.filter((l) => l.id !== id));
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/dashboard/instructor/courses/${courseId}`} className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]">
          ← Edit Course
        </Link>
        <span className="text-[color:var(--color-line)]">/</span>
        <span className="text-sm font-medium text-[color:var(--color-ink)]">Lessons</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[color:var(--color-ink)]">Lesson Builder</h1>
        <div className="flex gap-2">
          {lessons.length > 1 && (
            <button
              onClick={saveOrder}
              disabled={saving}
              className="rounded-xl border border-[color:var(--color-line)] px-4 py-2 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-line-2)] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Order"}
            </button>
          )}
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-xl bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--color-primary-2)] transition-colors"
          >
            + Add Lesson
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-xl border border-[color:var(--color-success)]/20 bg-[color:var(--color-success)]/5 p-3 text-sm text-[color:var(--color-success)]">
          {message}
        </div>
      )}

      {showForm && (
        <div className="mb-5 rounded-2xl border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/5 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-[color:var(--color-ink)]">New Lesson</h2>
          <input
            className="w-full rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] px-4 py-2.5 text-sm outline-none focus:border-[color:var(--color-primary)] transition-colors"
            placeholder="Lesson title"
            value={newLesson.title}
            onChange={(e) => setNewLesson((p) => ({ ...p, title: e.target.value }))}
          />
          <div className="flex gap-3">
            <select
              className="flex-1 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] px-4 py-2.5 text-sm outline-none"
              value={newLesson.type}
              onChange={(e) => setNewLesson((p) => ({ ...p, type: e.target.value as Lesson["type"] }))}
            >
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="text">Text</option>
              <option value="quiz">Quiz</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-[color:var(--color-ink)] cursor-pointer">
              <input
                type="checkbox"
                checked={newLesson.isFree}
                onChange={(e) => setNewLesson((p) => ({ ...p, isFree: e.target.checked }))}
                className="h-4 w-4 accent-[color:var(--color-primary)]"
              />
              Free preview
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addLesson}
              disabled={saving || !newLesson.title.trim()}
              className="rounded-xl bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Add
            </button>
            <button onClick={() => setShowForm(false)} className="rounded-xl border border-[color:var(--color-line)] px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-[color:var(--color-line)] animate-pulse" />
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 text-4xl">📋</div>
          <p className="text-[color:var(--color-muted)]">No lessons yet. Add your first lesson above.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <SortableLesson key={lesson.id} lesson={lesson} onDelete={deleteLesson} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {lessons.length > 0 && (
        <p className="mt-4 text-xs text-[color:var(--color-muted)] text-center">
          Drag lessons to reorder, then click "Save Order"
        </p>
      )}
    </div>
  );
}
