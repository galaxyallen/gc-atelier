import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.production.local" });

const TOKEN = process.env.VERCEL_TOKEN?.trim();
const TEAM = process.env.VERCEL_TEAM_SLUG?.trim() || "allens-projects-6acbb418";
const PROJECT = process.env.VERCEL_PROJECT?.trim() || "gc-atelier";

async function vercelApi(pathname) {
  const url = new URL(`https://api.vercel.com${pathname}`);
  url.searchParams.set("teamId", TEAM);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  return res.json();
}

const envs = (await vercelApi(`/v9/projects/${PROJECT}/env`)).envs ?? [];
const pgEnv = envs.find((e) => e.key === "POSTGRES_URL");
const detail = await vercelApi(`/v9/projects/${PROJECT}/env/${pgEnv.id}?decrypt=true`);
let url = detail.value;
try {
  const parsed = new URL(url);
  parsed.searchParams.delete("sslmode");
  parsed.searchParams.delete("ssl");
  url = parsed.toString();
} catch {
  /* keep */
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

const r = await client.query(
  `SELECT name, "isHero", "sortOrder", image FROM "Project" WHERE status = 'PUBLISHED' ORDER BY "sortOrder"`,
);
console.log("=== Published projects ===\n");
for (const row of r.rows) {
  console.log(
    row.sortOrder,
    row.isHero ? "HERO" : "card",
    row.name,
    row.image?.slice(0, 50),
  );
}

await client.end();
