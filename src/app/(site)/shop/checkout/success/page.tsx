import { Suspense } from "react";
import CheckoutSuccessPage from "./CheckoutSuccessClient";

export default function Page() {
  return (
    <Suspense fallback={
      <main className="page-wrap" style={{ paddingTop: 120, textAlign: "center" }}>
        <p style={{ color: "var(--fg2)" }}>Confirming your payment…</p>
      </main>
    }>
      <CheckoutSuccessPage />
    </Suspense>
  );
}
