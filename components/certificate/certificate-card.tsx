import Link from "next/link";

interface CertificateCardProps {
  certNumber: string;
  courseTitle: string;
  issuedAt: string;
}

export function CertificateCard({ certNumber, courseTitle, issuedAt }: CertificateCardProps) {
  const issued = new Date(issuedAt).toLocaleDateString("th-TH", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-accent)]/40 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-2)] p-5 text-white">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[color:var(--color-accent)]/10 -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 translate-y-6 -translate-x-4" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-[color:var(--color-accent)]">
            Certificate
          </span>
          <span className="text-xs text-white/60">{issued}</span>
        </div>

        <h3 className="font-bold text-lg leading-tight mb-3 line-clamp-2">{courseTitle}</h3>

        <div className="flex items-center justify-between">
          <code className="text-xs text-white/50 font-mono">{certNumber}</code>
          <Link
            href={`/certificate/${certNumber}`}
            className="rounded-lg bg-[color:var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[color:var(--color-accent-2)] transition-colors"
          >
            View & Download
          </Link>
        </div>
      </div>
    </div>
  );
}
