"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";

type SessionResult = {
  orderNumber: string;
  total: number;
  paymentStatus: string;
};

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [result, setResult] = useState<SessionResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("Missing payment session.");
      return;
    }

    fetch(`/api/payments/session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Unable to verify payment");
        }
        return res.json();
      })
      .then((data) => setResult(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Verification failed"));
  }, [sessionId]);

  return (
    <main className="page-wrap" style={{ paddingTop: 120, paddingBottom: 80, textAlign: "center" }}>
      <p className="eyebrow" style={{ marginBottom: 16 }}>
        Checkout
      </p>
      {error ? (
        <>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: 32, marginBottom: 12 }}>Payment verification</h1>
          <p style={{ color: "var(--fg2)", marginBottom: 24 }}>{error}</p>
        </>
      ) : !result ? (
        <p style={{ color: "var(--fg2)" }}>Confirming your payment…</p>
      ) : (
        <>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: 32, color: "var(--sage-l)", marginBottom: 12 }}>
            Thank you!
          </h1>
          <p style={{ color: "var(--fg2)", marginBottom: 8 }}>
            Order <strong>{result.orderNumber}</strong> has been placed.
          </p>
          <p style={{ color: "var(--fg3)", marginBottom: 32 }}>
            Total paid: {formatPrice(result.total)}
          </p>
        </>
      )}
      <Link href="/shop" className="btn-primary" style={{ display: "inline-block" }}>
        Continue shopping
      </Link>
    </main>
  );
}
