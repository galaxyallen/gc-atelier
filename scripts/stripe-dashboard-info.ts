/**
 * Print which Stripe account Vercel uses and recent test payments.
 * Usage: npx tsx scripts/stripe-dashboard-info.ts
 */
import { config } from "dotenv";
import Stripe from "stripe";

config({ path: ".env.production.local" });

const TOKEN = process.env.VERCEL_TOKEN?.trim();
const TEAM = process.env.VERCEL_TEAM_SLUG?.trim() || "allens-projects-6acbb418";
const PROJECT = process.env.VERCEL_PROJECT?.trim() || "gc-atelier";

async function getVercelStripeKey() {
  const envs = await fetch(
    `https://api.vercel.com/v9/projects/${PROJECT}/env?teamId=${TEAM}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } },
  ).then((r) => r.json());
  const row = envs.envs?.find(
    (e: { key: string; target?: string[] }) =>
      e.key === "STRIPE_SECRET_KEY" && e.target?.includes("production"),
  );
  const detail = await fetch(
    `https://api.vercel.com/v9/projects/${PROJECT}/env/${row.id}?decrypt=true&teamId=${TEAM}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } },
  ).then((r) => r.json());
  return detail.value as string;
}

async function main() {
  const sk = process.env.STRIPE_SECRET_KEY?.trim() || (await getVercelStripeKey());
  const stripe = new Stripe(sk);
  const mode = sk.startsWith("sk_test_") ? "TEST" : "LIVE";
  const keyHint = sk.slice(0, 16) + "…" + sk.slice(-6);

  console.log("=== Stripe keys on production (Vercel) ===\n");
  console.log("Mode:", mode, "(dashboard must use Test mode toggle if TEST)");
  console.log("Secret key hint:", keyHint);

  const sessions = await stripe.checkout.sessions.list({ limit: 10 });
  const paid = sessions.data.filter((s) => s.payment_status === "paid");

  console.log("\n=== Recent paid checkout sessions (API) ===\n");
  if (paid.length === 0) {
    console.log("(none)");
  } else {
    for (const s of paid.slice(0, 8)) {
      const when = new Date(s.created * 1000).toISOString();
      const amt = s.amount_total != null ? (s.amount_total / 100).toFixed(2) : "?";
      console.log(`${when}  $${amt}  ${s.metadata?.orderNumber ?? "-"}  ${s.id}`);
    }
  }

  console.log("\n=== Where to see these in Dashboard ===\n");
  if (mode === "TEST") {
    console.log("1. Open https://dashboard.stripe.com/test/payments");
    console.log("2. Turn ON **Test mode** (top-right toggle — orange = test)");
    console.log("3. Do NOT use https://dashboard.stripe.com/payments (that is Live — empty)");
  } else {
    console.log("1. Open https://dashboard.stripe.com/payments");
    console.log("2. Turn OFF Test mode (Live payments only)");
  }
  console.log("\n4. Log in with the Stripe account that owns this API key.");
  console.log("5. Developers → API keys → Secret key should start with:", sk.slice(0, 12));
}

main().catch((e) => {
  console.error("FAILED:", e.message || e);
  process.exit(1);
});
