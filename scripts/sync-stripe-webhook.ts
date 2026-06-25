/**
 * Recreate Stripe webhook endpoint and sync signing secret to Vercel.
 * Usage: npx tsx scripts/sync-stripe-webhook.ts
 */
import { config } from "dotenv";
import Stripe from "stripe";

config({ path: ".env.production.local" });

const TOKEN = process.env.VERCEL_TOKEN?.trim();
const TEAM = process.env.VERCEL_TEAM_SLUG?.trim() || "allens-projects-6acbb418";
const PROJECT = process.env.VERCEL_PROJECT?.trim() || "gc-atelier";
const WEBHOOK_URL = "https://gccreativehk.com/api/payments/webhook";

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

async function setWebhookSecret(secret: string) {
  const envs = (await vercelApi(`/v9/projects/${PROJECT}/env`)).envs ?? [];
  const existing = envs.find(
    (e: { key: string; target?: string[] }) =>
      e.key === "STRIPE_WEBHOOK_SECRET" && e.target?.includes("production"),
  );
  if (existing) {
    await vercelApi(`/v9/projects/${PROJECT}/env/${existing.id}`, {
      method: "DELETE",
    });
  }
  await vercelApi(`/v10/projects/${PROJECT}/env`, {
    method: "POST",
    body: JSON.stringify({
      key: "STRIPE_WEBHOOK_SECRET",
      value: secret,
      type: "encrypted",
      target: ["production", "preview"],
    }),
  });
}

async function main() {
  const stripe = new Stripe(await getStripeKey());

  const existing = await stripe.webhookEndpoints.list({ limit: 20 });
  for (const ep of existing.data) {
    console.log("→ Delete old endpoint:", ep.id, ep.url);
    await stripe.webhookEndpoints.del(ep.id);
  }

  const endpoint = await stripe.webhookEndpoints.create({
    url: WEBHOOK_URL,
    enabled_events: ["checkout.session.completed", "checkout.session.expired"],
    description: "GC Atelier checkout (auto-synced)",
  });

  if (!endpoint.secret?.startsWith("whsec_")) {
    throw new Error(
      `Invalid webhook signing secret from Stripe (expected whsec_, got ${endpoint.secret?.slice(0, 8) ?? "empty"})`,
    );
  }

  console.log("→ Created endpoint:", endpoint.id);
  console.log("→ Signing secret suffix:", endpoint.secret.slice(-8));

  await setWebhookSecret(endpoint.secret);
  console.log("→ Vercel STRIPE_WEBHOOK_SECRET updated");

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
  console.log("\nDone. In Stripe Dashboard delete any duplicate manual webhooks, then test with a NEW checkout.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
