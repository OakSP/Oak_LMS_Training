"use client";
import { useEffect, useState } from "react";

interface Payment {
  id: string;
  courseTitle: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]",
  pending: "bg-yellow-50 text-yellow-700",
  failed: "bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)]",
  refunded: "bg-gray-100 text-gray-600",
};

export function PaymentHistoryTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments/history")
      .then((r) => r.json())
      .then((d) => setPayments(d.data ?? []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-[color:var(--color-line)]" />
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-[color:var(--color-muted)]">
        No payment history yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--color-line)]">
      <table className="w-full text-sm">
        <thead className="bg-[color:var(--color-line-2)]">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wide">Course</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wide">Amount</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wide">Status</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wide">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--color-line)] bg-[color:var(--color-card)]">
          {payments.map((p) => (
            <tr key={p.id} className="hover:bg-[color:var(--color-line-2)]/50 transition-colors">
              <td className="px-4 py-3 font-medium text-[color:var(--color-ink)]">{p.courseTitle}</td>
              <td className="px-4 py-3 text-right text-[color:var(--color-ink)]">
                {p.amount === 0 ? "Free" : `${p.currency} ${p.amount.toLocaleString()}`}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[p.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-[color:var(--color-muted)]">
                {new Date(p.createdAt).toLocaleDateString("th-TH")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
