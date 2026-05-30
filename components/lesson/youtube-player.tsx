"use client";

import type { LearningLesson } from "@/types/learning";

function extractYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1].split("?")[0];
      return u.searchParams.get("v");
    }
  } catch {
    // invalid URL
  }
  return null;
}

export function YouTubePlayer({ lesson }: { lesson: LearningLesson }) {
  const videoId = lesson.contentUrl ? extractYoutubeId(lesson.contentUrl) : null;

  if (!videoId) {
    return (
      <div style={{
        borderRadius: 16,
        border: "1px solid var(--line)",
        background: "var(--card)",
        padding: 40,
        textAlign: "center",
        color: "var(--muted)",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>▶</div>
        <p style={{ margin: 0, fontSize: 14 }}>ไม่พบลิงก์ YouTube สำหรับบทเรียนนี้</p>
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "var(--shadow-md)",
      border: "1px solid color-mix(in srgb,var(--primary) 30%,transparent)",
      background: "#000",
      position: "relative",
      paddingBottom: "56.25%", // 16:9
      height: 0,
    }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={typeof lesson.title === "string" ? lesson.title : lesson.title.th}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </div>
  );
}
