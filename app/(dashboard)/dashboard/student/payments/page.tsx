import { requireUser } from "@/lib/auth/helpers";
import { PaymentHistoryTable } from "@/components/payment/payment-history-table";

export default async function PaymentHistoryPage() {
  await requireUser();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[color:var(--color-ink)]">Payment History</h1>
        <p className="text-sm text-[color:var(--color-muted)] mt-1">All your course purchases and enrollment records</p>
      </div>
      <PaymentHistoryTable />
    </div>
  );
}
