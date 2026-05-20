"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatbotAvatar } from "./chatbot-avatar";

type CourseCard = { id: string; title: string; price: number; level: string; hours: number };

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  courses?: CourseCard[];
};

const QUICK_REPLIES = ["คอร์สทั้งหมด", "ราคาคอร์ส", "คอร์สภาษาอังกฤษ", "วิธีสมัครเรียน", "เรียน On-site ที่ไหน"];

const INITIAL: Message = {
  id: "init",
  role: "bot",
  text: "สวัสดีค่ะ! หนูชื่อ โอ๊คกี้ ผู้ช่วยของ Oak LMS 😊\nถามหนูได้เลยนะคะ เรื่องคอร์สเรียน ราคา หรือวิธีสมัคร",
};

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 160);
  }, [isOpen]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json() as { text: string; courses?: CourseCard[] };
      await new Promise(r => setTimeout(r, 500));
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: data.text,
        courses: data.courses,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "ขอโทษค่ะ เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะคะ 🙏",
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const canSend = input.trim().length > 0 && !isTyping;

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>

      {/* ── Chat Panel ─────────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 76, right: 0,
        width: 360, height: 530,
        background: "var(--card, #fff)",
        borderRadius: 20,
        boxShadow: "0 30px 80px rgba(11,31,61,.22), 0 6px 20px rgba(11,31,61,.1)",
        display: "flex", flexDirection: "column", overflow: "hidden",
        border: "1px solid var(--line, #E4E7EE)",
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)",
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 0.22s ease, transform 0.22s ease",
      }}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #0B1F3D 0%, #1A3461 100%)",
          padding: "12px 14px",
          display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
        }}>
          <div style={{ borderRadius: "50%", overflow: "hidden", width: 42, height: 42, background: "rgba(255,255,255,0.1)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChatbotAvatar size={42} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>โอ๊คกี้</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", display: "inline-block", flexShrink: 0 }} />
              ผู้ช่วยออนไลน์ Oak LMS
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="ปิด"
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "white", fontSize: 18, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >×</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 14, background: "var(--bg, #FAFAF7)" }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 6 }}>

              {msg.role === "bot" && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 7, maxWidth: "90%" }}>
                  <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", overflow: "hidden", background: "white", border: "1.5px solid var(--line, #E4E7EE)" }}>
                    <ChatbotAvatar size={30} />
                  </div>
                  <div style={{ background: "white", borderRadius: "14px 14px 14px 4px", padding: "10px 13px", fontSize: 13.5, lineHeight: 1.65, color: "var(--ink, #0A1530)", whiteSpace: "pre-line", boxShadow: "0 1px 4px rgba(11,31,61,.07)", border: "1px solid var(--line, #E4E7EE)" }}>
                    {msg.text}
                  </div>
                </div>
              )}

              {msg.role === "user" && (
                <div style={{ background: "var(--primary, #0B1F3D)", borderRadius: "14px 14px 4px 14px", padding: "10px 13px", maxWidth: "78%", fontSize: 13.5, lineHeight: 1.65, color: "white" }}>
                  {msg.text}
                </div>
              )}

              {/* Course cards */}
              {msg.courses && msg.courses.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: msg.role === "bot" ? 37 : 0, width: "100%" }}>
                  {msg.courses.slice(0, 3).map(c => (
                    <a
                      key={c.id}
                      href={`/courses/${c.id}`}
                      style={{ display: "block", background: "white", border: "1px solid var(--line, #E4E7EE)", borderRadius: 10, padding: "9px 12px", textDecoration: "none", transition: "box-shadow 0.15s", boxShadow: "0 1px 4px rgba(11,31,61,.05)" }}
                    >
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink, #0A1530)", lineHeight: 1.45, marginBottom: 4 }}>{c.title}</div>
                      <div style={{ display: "flex", gap: 8, fontSize: 11.5, color: "var(--muted, #4A5773)", alignItems: "center" }}>
                        <span style={{ background: "var(--line-2, #EFF1F6)", borderRadius: 4, padding: "1px 5px" }}>{c.level}</span>
                        <span>{c.hours} ชม.</span>
                        <span style={{ marginLeft: "auto", color: "var(--accent, #B8763A)", fontWeight: 700, fontSize: 12 }}>฿{c.price.toLocaleString()}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
              <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", overflow: "hidden", background: "white", border: "1.5px solid var(--line, #E4E7EE)" }}>
                <ChatbotAvatar size={30} />
              </div>
              <div style={{ background: "white", borderRadius: "14px 14px 14px 4px", padding: "11px 14px", display: "flex", gap: 5, alignItems: "center", border: "1px solid var(--line, #E4E7EE)" }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--muted-2, #7B8699)", display: "inline-block", animationName: "oakchat-bounce", animationDuration: "1.2s", animationTimingFunction: "ease-in-out", animationDelay: `${i * 0.2}s`, animationIterationCount: "infinite" }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies — only on first message */}
        {messages.length === 1 && !isTyping && (
          <div style={{ padding: "8px 12px 0", background: "var(--bg, #FAFAF7)", display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }}>
            {QUICK_REPLIES.map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                style={{ background: "white", border: "1px solid var(--accent, #B8763A)", borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "var(--accent, #B8763A)", cursor: "pointer", fontWeight: 500, transition: "background 0.15s" }}
              >{q}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: "10px 12px", borderTop: "1px solid var(--line, #E4E7EE)", display: "flex", gap: 8, alignItems: "center", background: "white", flexShrink: 0 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="ถามเกี่ยวกับคอร์สเรียน..."
            disabled={isTyping}
            style={{ flex: 1, border: "1.5px solid var(--line, #E4E7EE)", borderRadius: 12, padding: "9px 13px", fontSize: 13.5, outline: "none", background: "var(--bg, #FAFAF7)", color: "var(--ink, #0A1530)", fontFamily: "inherit", transition: "border-color 0.15s" }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--primary, #0B1F3D)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--line, #E4E7EE)"; }}
          />
          <button
            onClick={() => send(input)}
            disabled={!canSend}
            aria-label="ส่งข้อความ"
            style={{ background: canSend ? "var(--primary, #0B1F3D)" : "var(--line, #E4E7EE)", border: "none", borderRadius: 12, width: 42, height: 42, cursor: canSend ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}
          >
            <svg viewBox="0 0 20 20" width={17} height={17} fill="none">
              <path d="M2.5 10L17.5 2.5L13 10L17.5 17.5L2.5 10Z" fill={canSend ? "white" : "var(--muted-2, #7B8699)"} />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Floating Button ────────────────────────────── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? "ปิด chatbot" : "เปิด chatbot"}
        style={{
          width: 62, height: 62, borderRadius: "50%",
          background: "linear-gradient(145deg, #0B1F3D 0%, #1A3461 100%)",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(11,31,61,.40), 0 0 0 3px rgba(184,118,58,.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", padding: 0,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.09)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(11,31,61,.50), 0 0 0 4px rgba(184,118,58,.45)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(11,31,61,.40), 0 0 0 3px rgba(184,118,58,.35)";
        }}
      >
        {isOpen ? (
          <svg viewBox="0 0 20 20" width={22} height={22} fill="none">
            <path d="M4 4L16 16M16 4L4 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : (
          <ChatbotAvatar size={58} />
        )}
      </button>
    </div>
  );
}
