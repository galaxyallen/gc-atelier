/**
 * Delete all Stripe config (Vercel env + Stripe webhooks) and set up fresh.
 * Usage: npm run stripe:reset
 *
 * Requires in .env.production.local:
 *   VERCEL_TOKEN
 * Optional (if not on Vercel, must be set locally):
 *   STRIPE_SECRET_KEY=sk_test_...
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
 */
import { config } from "dotenv";
import Stripe from "stripe";

config({ path: ".env.production.local" });

const TOKEN = process.env.VERCEL_TOKEN?.trim();
const TEAM = process.env.VERCEL_TEAM_SLUG?.trim() || "allens-projects-6acbb418";
const PROJECT = process.env.VERCEL_PROJECT?.trim() || "gc-atelier";
const WEBHOOK_URL = "https://gccreativehk.com/api/payments/webhook";

const STRIPE_ENV_KEYS = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_CURRENCY",
  "STRIPE_PUBLISHABLE_KEY",
  "STRIPE_MCP_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
];

async function vercelApi(pathname: string, options: RequestInit = {}) {
  const url = new URL(`https://api.vercel.com${pathname}`);
  url.searchParams.set("teamId", TEAM);
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${pathname} ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function getDecryptedEnv(key: string) {
  const envs = (await vercelApi(`/v9/projects/${PROJECT}/env`)).envs ?? [];
  const row = envs.find(
    (e: { key: string; target?: string[] }) =>
      e.key === key && e.target?.includes("production"),
  );
  if (!row) return null;
  const detail = await vercelApi(
    `/v9/projects/${PROJECT}/env/${row.id}?decrypt=true`,
  );
  return (detail.value as string)?.trim() || null;
}

async function deleteAllStripeEnv() {
  const envs = (await vercelApi(`/v9/projects/${PROJECT}/env`)).envs ?? [];
  const stripeRows = envs.filter((e: { key: string }) =>
    STRIPE_ENV_KEYS.includes(e.key),
  );
  for (const row of stripeRows) {
    console.log("→ Delete Vercel env:", row.key, row.target);
    await vercelApi(`/v9/projects/${PROJECT}/env/${row.id}`, {
      method: "DELETE",
    });
  }
}

async function setEnv(key: string, value: string, targets: string[]) {
  try {
    await vercelApi(`/v10/projects/${PROJECT}/env`, {
      method: "POST",
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: targets,
      }),
    });
    console.log("→ Set", key);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("ENV_CONFLICT")) {
      console.log("→ Skip (already exists):", key);
      return;
    }
    throw e;
  }
}

async function main() {
  if (!TOKEN) {
    console.error("VERCEL_TOKEN required in .env.production.local");
    process.exit(1);
  }

  console.log("=== Step 1: Save keys before delete ===\n");
  let secretKey =
    process.env.STRIPE_SECRET_KEY?.trim() ||
    (await getDecryptedEnv("STRIPE_SECRET_KEY"));
  let publishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ||
    (await getDecryptedEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")) ||
    (await getDecryptedEnv("STRIPE_PUBLISHABLE_KEY"));

  if (!secretKey?.startsWith("sk_")) {
    console.error(
      "Missing STRIPE_SECRET_KEY. Add sk_test_... to .env.production.local from Stripe → Developers → API keys",
    );
    process.exit(1);
  }
  if (!publishableKey?.startsWith("pk_")) {
    publishableKey = secretKey.replace(/^sk_/, "pk_");
  }
  console.log("Secret key:", secretKey.slice(0, 12) + "...");
  if (publishableKey) {
    console.log("Publishable key:", publishableKey.slice(0, 12) + "...");
  }

  const stripe = new Stripe(secretKey);

  console.log("\n=== Step 2: Delete Stripe webhook endpoints ===\n");
  const endpoints = await stripe.webhookEndpoints.list({ limit: 50 });
  for (const ep of endpoints.data) {
    console.log("→ Delete endpoint:", ep.id, ep.url);
    await stripe.webhookEndpoints.del(ep.id);
  }
  if (endpoints.data.length === 0) {
    console.log("(none)");
  }

  console.log("\n=== Step 3: Delete all Stripe env on Vercel ===\n");
  await deleteAllStripeEnv();

  console.log("\n=== Step 4: Create webhook + set env ===\n");
  const endpoint = await stripe.webhookEndpoints.create({
    url: WEBHOOK_URL,
    enabled_events: ["checkout.session.completed", "checkout.session.expired"],
    description: "GC Atelier checkout",
  });

  if (!endpoint.secret?.startsWith("whsec_")) {
    throw new Error("Stripe did not return a valid whsec_ signing secret");
  }

  console.log("→ Webhook endpoint:", endpoint.id);
  console.log("→ Signing secret suffix:", endpoint.secret.slice(-8));

  const prodPreview = ["production", "preview"];
  await setEnv("STRIPE_SECRET_KEY", secretKey, prodPreview);
  await setEnv("STRIPE_WEBHOOK_SECRET", endpoint.secret, prodPreview);
  await setEnv("STRIPE_CURRENCY", "usd", ["production"]);
  await setEnv("NEXT_PUBLIC_SHOP_CURRENCY", "USD", ["production"]);
  if (publishableKey?.startsWith("pk_")) {
    await setEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", publishableKey, prodPreview);
  }

  console.log("\n=== Step 5: Verify + redeploy ===\n");
  const verifyWh = await getDecryptedEnv("STRIPE_WEBHOOK_SECRET");
  const verifySk = await getDecryptedEnv("STRIPE_SECRET_KEY");
  if (verifyWh !== endpoint.secret) {
    throw new Error("Vercel STRIPE_WEBHOOK_SECRET mismatch after set");
  }
  if (!verifyWh?.startsWith("whsec_")) {
    throw new Error("Vercel STRIPE_WEBHOOK_SECRET is not whsec_");
  }
  if (verifySk !== secretKey) {
    throw new Error("Vercel STRIPE_SECRET_KEY mismatch after set");
  }
  console.log("→ Env verified OK");

  const project = await vercelApi(`/v9/projects/${PROJECT}`);
  const dep = await vercelApi(`/v13/deployments`, {
    method: "POST",
    body: JSON.stringify({
      name: PROJECT,
      project: project.id,
      target: "production",
      gitSource: {
        type: "github",
        org: "galaxyallen",
        repo: "gc-atelier",
        ref: "main",
      },
    }),
  });
  console.log("→ Redeploy:", dep.url || dep.id);

  const depId = dep.id as string;
  for (let i = 0; i < 24; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const status = await vercelApi(`/v13/deployments/${depId}`);
    if (status.readyState === "READY") {
      console.log("→ Deployment ready");
      break;
    }
    if (status.readyState === "ERROR" || status.readyState === "CANCELED") {
      throw new Error(`Deploy ${status.readyState}`);
    }
  }

  const payload = JSON.stringify({
    id: "evt_verify",
    object: "event",
    type: "checkout.session.completed",
    data: { object: { payment_status: "paid", metadata: { orderId: "skip" } } },
  });
  const sig = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: endpoint.secret,
  });
  const testRes = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": sig,
    },
    body: payload,
  });
  console.log("→ Live webhook test:", testRes.status, (await testRes.text()).slice(0, 60));

  console.log("\n✓ Stripe reset complete.");
  console.log("\nIn Stripe Dashboard (Test mode):");
  console.log("  - Webhooks → only ONE endpoint:", WEBHOOK_URL);
  console.log("  - Delete any old manual webhooks (e.g. captivating-excellence)");
  console.log("\nTest: shop checkout with card 4242 4242 4242 4242");
}

main().catch((e) => {
  console.error("FAILED:", e.message || e);
  process.exit(1);
});
