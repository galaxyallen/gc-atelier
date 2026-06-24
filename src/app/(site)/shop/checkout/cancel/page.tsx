import Link from "next/link";

export default function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderNumber = searchParams.order;

  return (
    <main className="page-wrap" style={{ paddingTop: 120, paddingBottom: 80, textAlign: "center" }}>
      <p className="eyebrow" style={{ marginBottom: 16 }}>
        Checkout
      </p>
      <h1 style={{ fontFamily: "var(--fd)", fontSize: 32, marginBottom: 12 }}>Payment cancelled</h1>
      <p style={{ color: "var(--fg2)", marginBottom: 8 }}>
        Your payment was not completed.
        {orderNumber ? ` Order ${orderNumber} is still pending.` : ""}
      </p>
      <p style={{ color: "var(--fg3)", marginBottom: 32 }}>
        You can return to the shop and try again, or contact us for assistance.
      </p>
      <Link href="/shop" className="btn-primary" style={{ display: "inline-block" }}>
        Back to shop
      </Link>
    </main>
  );
}
