"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--color-danger)]/10">
        <svg
          className="h-8 w-8 text-[color:var(--color-danger)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M5.07 19H19a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.27 16A2 2 0 005.07 19z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-[color:var(--color-ink)]">
        Something went wrong
      </h2>
      <p className="max-w-sm text-sm text-[color:var(--color-muted)]">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-[color:var(--color-primary)] px-5 py-2 text-sm font-medium text-white hover:bg-[color:var(--color-primary-2)] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
