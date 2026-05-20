import { CertificatePreview } from "@/components/certificate/certificate-preview";

interface PageProps {
  params: Promise<{ certId: string }>;
}

interface CertData {
  certNumber: string;
  studentName: string;
  courseTitle: string;
  issuedAt: string;
  isValid: boolean;
}

async function fetchCert(certId: string): Promise<CertData | null> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/certificates/${certId}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

export default async function CertificateVerifyPage({ params }: PageProps) {
  const { certId } = await params;
  const cert = await fetchCert(certId);

  if (!cert) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-4xl mb-4">❌</div>
        <h1 className="text-xl font-bold text-[color:var(--color-ink)] mb-2">Certificate Not Found</h1>
        <p className="text-sm text-[color:var(--color-muted)]">
          The certificate ID <code className="font-mono bg-[color:var(--color-line-2)] px-1 rounded">{certId}</code> does not exist or has been revoked.
        </p>
      </div>
    );
  }

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/certificate/${cert.certNumber}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-success)]/10 px-4 py-1.5 text-sm font-medium text-[color:var(--color-success)] mb-4">
          ✓ Verified Certificate
        </span>
        <h1 className="text-2xl font-bold text-[color:var(--color-ink)]">Certificate of Completion</h1>
        <p className="text-sm text-[color:var(--color-muted)] mt-1">
          This certificate has been verified as authentic by Oak LMS.
        </p>
      </div>

      <CertificatePreview
        certNumber={cert.certNumber}
        studentName={cert.studentName}
        courseTitle={cert.courseTitle}
        issuedAt={cert.issuedAt}
        verifyUrl={verifyUrl}
      />
    </div>
  );
}
