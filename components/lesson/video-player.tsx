"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/shared/icon";
import type { LearningLesson } from "@/types/learning";

interface VideoPlayerProps {
  lesson: LearningLesson;
  initialWatchTime: number;
  onProgress: (watchTime: number, isCompleted?: boolean) => void;
}

function formatTime(totalSec: number) {
  const min = Math.floor(totalSec / 60);
  const sec = Math.floor(totalSec % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

export function VideoPlayer({ lesson, initialWatchTime, onProgress }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [watchTime, setWatchTime] = useState(Math.min(initialWatchTime, lesson.durationSec));

  useEffect(() => {
    if (!playing) return;

    const timer = window.setInterval(() => {
      setWatchTime((current) => {
        const next = Math.min(current + 1, lesson.durationSec);
        if (next % 5 === 0 || next === lesson.durationSec) {
          onProgress(next, next >= Math.round(lesson.durationSec * 0.9));
        }
        if (next >= lesson.durationSec) setPlaying(false);
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [lesson.durationSec, onProgress, playing]);

  const percent = lesson.durationSec === 0 ? 0 : Math.round((watchTime / lesson.durationSec) * 100);

  return (
    <div style={{
      borderRadius: 16,
      overflow: "hidden",
      background: "linear-gradient(135deg,#08152e,#14294f 55%,#2a477a)",
      color: "#fff",
      boxShadow: "var(--shadow-md)",
      border: "1px solid color-mix(in srgb,var(--primary) 30%,transparent)",
    }}>
      <div style={{
        minHeight: 360,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}>
        <div aria-hidden style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 20% 20%,rgba(216,155,94,.28),transparent 34%), radial-gradient(circle at 80% 10%,rgba(255,255,255,.14),transparent 28%)",
        }} />
        <button
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause lesson" : "Play lesson"}
          style={{
            width: 82,
            height: 82,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,.28)",
            background: "rgba(255,255,255,.14)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(16px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Icon name={playing ? "pause" : "play"} size={28} />
        </button>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, zIndex: 1 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, opacity: .75, marginBottom: 5 }}>Demo video lesson</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{lesson.title.th}</div>
          </div>
          <div style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,.2)", overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", borderRadius: 99, background: "var(--accent)", transition: "width .2s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, opacity: .85 }}>
            <span>{formatTime(watchTime)}</span>
            <span>{formatTime(lesson.durationSec)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
