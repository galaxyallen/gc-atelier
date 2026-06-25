/** Site runs in test/staging mode (vercel.app + Stripe test keys). */
export function isTestMode() {
  return process.env.NEXT_PUBLIC_SITE_MODE === "test";
}

export function isStripeTestMode() {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  return key.startsWith("sk_test_");
}
