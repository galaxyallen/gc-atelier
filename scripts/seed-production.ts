/**
 * Seed production CMS content (12 projects, 9 products, page content).
 * Keeps existing admin accounts. Requires VERCEL_TOKEN in .env.production.local.
 *
 * Usage: npm run seed:production
 */
import { config } from "dotenv";
import { seedDatabaseContent } from "../src/lib/seed-database";

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
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${pathname} ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function getPostgresUrl() {
  const envs = (await vercelApi(`/v9/projects/${PROJECT}/env`)).envs ?? [];
  const pgEnv = envs.find(
    (e: { key: string; target?: string[] }) =>
      e.key === "POSTGRES_URL" && e.target?.includes("production"),
  );
  if (!pgEnv) throw new Error("POSTGRES_URL not found on Vercel");
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
  return url;
}

async function main() {
  if (!TOKEN) {
    console.error("VERCEL_TOKEN required in .env.production.local");
    process.exit(1);
  }

  const dbUrl = await getPostgresUrl();
  process.env.DATABASE_URL = dbUrl;
  process.env.POSTGRES_URL = dbUrl;

  const force = process.argv.includes("--force");
  console.log(`→ Seeding production content${force ? " (force)" : ""}…`);
  const result = await seedDatabaseContent(force);
  console.log(result === "seeded" ? "✓ Content seeded" : "○ Already seeded (use --force to replace)");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
