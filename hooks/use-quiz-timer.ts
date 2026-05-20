"use client";

import { useEffect, useMemo, useState } from "react";

export function useQuizTimer(timeLimitSec: number | null, isRunning: boolean) {
  const [remaining, setRemaining] = useState(() => timeLimitSec ?? 0);

  useEffect(() => {
    if (!timeLimitSec || !isRunning || remaining <= 0) return;

    const interval = window.setInterval(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, remaining, timeLimitSec]);

  const formatted = useMemo(() => {
    if (!timeLimitSec) return "ไม่จำกัดเวลา";
    const min = Math.floor(remaining / 60).toString().padStart(2, "0");
    const sec = (remaining % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  }, [remaining, timeLimitSec]);

  return {
    remaining,
    formatted,
    isExpired: Boolean(timeLimitSec && remaining <= 0),
    reset: () => setRemaining(timeLimitSec ?? 0),
  };
}
