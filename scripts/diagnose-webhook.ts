/**
 * End-to-end webhook diagnostic against production.
 * Usage: npx tsx scripts/diagnose-webhook.ts
 */
import { config } from "dotenv";
import Stripe from "stripe";

config({ path: ".env.production.local" });

const TOKEN = process.env.VERCEL_TOKEN?.trim();
const TEAM = process.env.VERCEL_TEAM_SLUG?.trim() || "allens-projects-6acbb418";
const PROJECT = process.env.VERCEL_PROJECT?.trim() || "gc-atelier";
const WEBHOOK_URL = "https://gccreativehk.com/api/payments/webhook";

async function vercelApi(pathname: string) {
  const url = new URL(`https://api.vercel.com${pathname}`);
  url.searchParams.set("teamId", TEAM);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${pathname} ${res.status}: ${JSON.stringify(body)}`);
  return body;
}

async function getEnv(key: string) {
  const envs = (await vercelApi(`/v9/projects/${PROJECT}/env`)).envs ?? [];
  const row = envs.find(
    (e: { key: string; target?: string[] }) =>
      e.key === key && e.target?.includes("production"),
  );
  if (!row) throw new Error(`${key} missing on Vercel production`);
  const detail = await vercelApi(
    `/v9/projects/${PROJECT}/env/${row.id}?decrypt=true`,
  );
  return { value: detail.value as string, type: row.type as string };
}

async function postWebhook(body: string, signature: string) {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": signature,
    },
    body,
  });
  const text = await res.text();
  return { status: res.status, text };
}

async function main() {
  console.log("=== Webhook diagnostic ===\n");

  const noSig = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  console.log("1. No signature:", noSig.status, await noSig.text());

  const wh = await getEnv("STRIPE_WEBHOOK_SECRET");
  const sk = await getEnv("STRIPE_SECRET_KEY");
  console.log("\n2. Vercel env:");
  console.log("   STRIPE_WEBHOOK_SECRET type=", wh.type, "len=", wh.value.length);
  console.log("   STRIPE_SECRET_KEY prefix=", sk.value.slice(0, 12));

  const stripe = new Stripe(sk.value);
  const sessions = await stripe.checkout.sessions.list({ limit: 5 });
  const paid = sessions.data.find((s) => s.payment_status === "paid");
  console.log("\n3. Latest paid session:", paid?.id, paid?.metadata?.orderNumber);

  if (!paid) {
    console.log("   No paid sessions to simulate.");
    return;
  }

  const event = {
    id: "evt_diagnostic_test",
    object: "event",
    type: "checkout.session.completed",
    data: { object: paid },
  };
  const payload = JSON.stringify(event);
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: wh.value,
  });

  const result = await postWebhook(payload, signature);
  console.log("\n4. Simulated webhook POST:");
  console.log("   status:", result.status);
  console.log("   body:", result.text);

  console.log("\n5. Stripe webhook endpoints:");
  const endpoints = await stripe.webhookEndpoints.list({ limit: 5 });
  for (const ep of endpoints.data) {
    console.log("  ", ep.url, ep.status, "events:", ep.enabled_events.join(", "));
  }
}

main().catch((e) => {
  console.error("FAILED:", e.message || e);
  process.exit(1);
});
