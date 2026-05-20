"use client";

interface CertificatePreviewProps {
  certNumber: string;
  studentName: string;
  courseTitle: string;
  issuedAt: string;
  verifyUrl?: string;
}

export function CertificatePreview({
  certNumber,
  studentName,
  courseTitle,
  issuedAt,
  verifyUrl,
}: CertificatePreviewProps) {
  const issued = new Date(issuedAt).toLocaleDateString("en-GB", {
    year: "numeric", month: "long", day: "numeric",
  });

  function handlePrint() {
    window.print();
  }

  return (
    <div>
      {/* Print/download button */}
      <div className="mb-4 flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[color:var(--color-primary-2)] transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download / Print
        </button>
      </div>

      {/* Certificate canvas */}
      <div
        id="certificate-canvas"
        className="relative mx-auto overflow-hidden"
        style={{
          width: "100%",
          maxWidth: 794,
          aspectRatio: "794/562",
          border: "12px solid #B8763A",
          background: "#ffffff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 8,
            border: "2px solid #B8763A",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "24px 48px", textAlign: "center",
          }}
        >
          {/* Top label */}
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#B8763A", marginBottom: 10 }}>
            Certificate of Completion
          </p>

          {/* Brand */}
          <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#0B1F3D", marginBottom: 6 }}>
            Oak LMS
          </h1>

          <p style={{ fontSize: 13, color: "#4A5773", marginBottom: 18 }}>
            This is to certify that
          </p>

          {/* Student name */}
          <div style={{
            fontSize: 24, fontStyle: "italic", color: "#0B1F3D",
            borderBottom: "1.5px solid #B8763A", paddingBottom: 6,
            marginBottom: 16, minWidth: 280,
          }}>
            {studentName}
          </div>

          <p style={{ fontSize: 12, color: "#4A5773", marginBottom: 5 }}>
            has successfully completed
          </p>

          <div style={{ fontSize: 18, fontWeight: "bold", color: "#0B1F3D", marginBottom: 20 }}>
            {courseTitle}
          </div>

          {/* Footer */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            width: "100%", fontSize: 10, color: "#7B8699", marginTop: 12,
          }}>
            <span>Issued: {issued}</span>
            <span style={{ fontFamily: "monospace" }}>ID: {certNumber}</span>
            {verifyUrl && <span>Verify: {verifyUrl}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
