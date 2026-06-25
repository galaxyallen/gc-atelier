/**
 * One-shot production setup:
 * 1. Validate .env.production.local
 * 2. Create Supabase uploads bucket
 * 3. Push env vars to Vercel (if VERCEL_TOKEN set)
 * 4. Trigger production redeploy
 *
 * Usage: fill .env.production.local then npm run configure:production
 */
import { config } from "dotenv";
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import path from "path";

const envPath = path.join(process.cwd(), ".env.production.local");
if (!existsSync(envPath)) {
  console.error("Missing .env.production.local");
  process.exit(1);
}
config({ path: envPath });

const TOKEN = process.env.VERCEL_TOKEN?.trim();
const TEAM_SLUG = process.env.VERCEL_TEAM_SLUG?.trim() || "allens-projects-6acbb418";
const PROJECT = process.env.VERCEL_PROJECT?.trim() || "gc-atelier";

const REQUIRED = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_KEY",
];

const PUSH_KEYS = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_KEY",
  "NEXT_PUBLIC_SHOP_CURRENCY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_CURRENCY",
];

function parseEnvFile() {
  const vars = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (v) vars[k] = v;
  }
  return vars;
}

async function vercelApi(pathname, options = {}) {
  if (!TOKEN) throw new Error("VERCEL_TOKEN missing");
  const url = new URL(`https://api.vercel.com${pathname}`);
  if (TEAM_SLUG) url.searchParams.set("teamId", TEAM_SLUG);
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

async function listEnv() {
  const res = await vercelApi(`/v9/projects/${PROJECT}/env`);
  return res.envs ?? [];
}

async function upsertEnv(key, value) {
  console.log(`→ Vercel env: ${key}`);
  const envs = await listEnv();
  const existing = envs.find(
    (e) => e.key === key && e.target?.includes("production"),
  );
  if (existing) {
    await vercelApi(`/v9/projects/${PROJECT}/env/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: ["production"],
      }),
    });
    return;
  }
  await vercelApi(`/v10/projects/${PROJECT}/env`, {
    method: "POST",
    body: JSON.stringify({
      key,
      value,
      type: "encrypted",
      target: ["production"],
    }),
  });
}

async function redeploy() {
  console.log("→ Trigger production redeploy…");
  const project = await vercelApi(`/v9/projects/${PROJECT}`);
  const res = await vercelApi(`/v13/deployments`, {
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
  console.log("  Deployment:", res.url || res.alias?.[0] || res.id);
}

async function ensureUploadsBucket() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  );
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;
  if (buckets?.some((b) => b.name === "uploads")) {
    console.log("→ Supabase bucket uploads: OK");
    return;
  }
  const { error } = await supabase.storage.createBucket("uploads", { public: false });
  if (error) throw error;
  console.log("→ Supabase bucket uploads: created");
}

async function main() {
  const missing = REQUIRED.filter((k) => !process.env[k]?.trim());
  if (missing.length) {
    console.error("Missing in .env.production.local:", missing.join(", "));
    process.exit(1);
  }

  if (!process.env.DATABASE_URL.startsWith("postgres")) {
    console.error("DATABASE_URL must be a postgres:// or postgresql:// URL");
    process.exit(1);
  }

  if (
    process.env.DATABASE_URL.includes("[YOUR-PASSWORD]") ||
    process.env.DATABASE_URL.includes("[password]")
  ) {
    console.error(
      "DATABASE_URL still contains [YOUR-PASSWORD] — replace with your Supabase database password.",
    );
    process.exit(1);
  }

  console.log("✓ Local env validation passed\n");

  await ensureUploadsBucket();

  if (TOKEN) {
    const vars = parseEnvFile();
    for (const key of PUSH_KEYS) {
      if (vars[key]) await upsertEnv(key, vars[key]);
    }
    await redeploy();
  } else {
    console.warn("\nVERCEL_TOKEN not set — skipped Vercel push/redeploy.");
    console.warn("Add VERCEL_TOKEN and run again, or paste vars manually in Vercel UI.");
  }

  console.log("\nDone. Verify:");
  console.log("  https://gc-atelier.vercel.app/admin/login");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
