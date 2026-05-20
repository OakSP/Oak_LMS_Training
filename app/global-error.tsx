"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html>
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            fontFamily: "sans-serif",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0A1530" }}>
            Critical Error
          </h1>
          <p style={{ color: "#4A5773", maxWidth: "400px" }}>
            The application encountered a critical error. Please refresh or try again.
          </p>
          {error.digest && (
            <code style={{ fontSize: "12px", color: "#7B8699" }}>
              Digest: {error.digest}
            </code>
          )}
          <button
            onClick={reset}
            style={{
              padding: "8px 24px",
              background: "#0B1F3D",
              color: "#fff",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
