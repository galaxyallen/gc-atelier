/**
 * Mark Stripe-paid orders as PAID when webhook was not configured.
 * Usage: npx tsx scripts/sync-stripe-orders.ts
 */
import { config } from "dotenv";
import Stripe from "stripe";

config({ path: ".env.production.local" });

const TOKEN = process.env.VERCEL_TOKEN?.trim();
const TEAM = process.env.VERCEL_TEAM_SLUG?.trim() || "allens-projects-6acbb418";
const PROJECT = process.env.VERCEL_PROJECT?.trim() || "gc-atelier";

async function vercelApi(pathname: string) {
  const url = new URL(`https://api.vercel.com${pathname}`);
  url.searchParams.set("teamId", TEAM);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return res.json();
}

async function getStripeKey() {
  const envs = (await vercelApi(`/v9/projects/${PROJECT}/env`)).envs ?? [];
  const row = envs.find(
    (e: { key: string; target?: string[] }) =>
      e.key === "STRIPE_SECRET_KEY" && e.target?.includes("production"),
  );
  const detail = await vercelApi(
    `/v9/projects/${PROJECT}/env/${row.id}?decrypt=true`,
  );
  return detail.value as string;
}

async function getPostgresUrl() {
  const envs = (await vercelApi(`/v9/projects/${PROJECT}/env`)).envs ?? [];
  const pgEnv = envs.find(
    (e: { key: string; target?: string[] }) =>
      e.key === "POSTGRES_URL" && e.target?.includes("production"),
  );
  const detail = await vercelApi(
    `/v9/projects/${PROJECT}/env/${pgEnv.id}?decrypt=true`,
  );
  let url = detail.value as string;
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("sslmode");
    parsed.searchParams.delete("ssl");
    url = parsed.toString();
  } catch {
    /* keep */
  }
  process.env.DATABASE_URL = url;
  process.env.POSTGRES_URL = url;
}

async function main() {
  await getPostgresUrl();
  const { fulfillPaidOrder } = await import("../src/lib/create-pending-order");

  const stripe = new Stripe(await getStripeKey());
  const sessions = await stripe.checkout.sessions.list({ limit: 20 });

  for (const session of sessions.data) {
    if (session.payment_status !== "paid") continue;
    const orderId = session.metadata?.orderId;
    if (!orderId) continue;
    await fulfillPaidOrder(orderId);
    console.log("fulfilled", session.metadata?.orderNumber, orderId);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
