"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
  courseId: string;
  price: number;
  isFree: boolean;
  className?: string;
}

export function CheckoutButton({ courseId, price, isFree, className }: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Checkout failed");
        return;
      }

      if (data.enrolled) {
        router.push("/dashboard/student");
        router.refresh();
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const label = loading
    ? "Processing..."
    : isFree || price === 0
    ? "Enroll Free"
    : `Buy — ฿${price.toLocaleString()}`;

  return (
    <div>
      {error && (
        <p className="mb-2 text-xs text-[color:var(--color-danger)]">{error}</p>
      )}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={className ?? "w-full rounded-xl bg-[color:var(--color-accent)] py-3 text-sm font-semibold text-white hover:bg-[color:var(--color-accent-2)] disabled:opacity-50 transition-colors"}
      >
        {label}
      </button>
    </div>
  );
}
