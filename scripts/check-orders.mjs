import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.production.local" });

const TOKEN = process.env.VERCEL_TOKEN?.trim();
const TEAM = process.env.VERCEL_TEAM_SLUG?.trim() || "allens-projects-6acbb418";
const PROJECT = process.env.VERCEL_PROJECT?.trim() || "gc-atelier";

async function vercelApi(pathname) {
  const url = new URL(`https://api.vercel.com${pathname}`);
  url.searchParams.set("teamId", TEAM);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return res.json();
}

async function getPostgresUrl() {
  const envs = (await vercelApi(`/v9/projects/${PROJECT}/env`)).envs ?? [];
  const pgEnv = envs.find(
    (e) => e.key === "POSTGRES_URL" && e.target?.includes("production"),
  );
  const detail = await vercelApi(
    `/v9/projects/${PROJECT}/env/${pgEnv.id}?decrypt=true`,
  );
  let url = detail.value;
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

const client = new pg.Client({
  connectionString: await getPostgresUrl(),
  ssl: { rejectUnauthorized: false },
});
await client.connect();

const orders = await client.query(
  `SELECT "orderNumber", "paymentStatus", "orderStatus", total, "createdAt"
   FROM "Order" ORDER BY "createdAt" DESC LIMIT 10`,
);
console.log("Recent orders:");
for (const row of orders.rows) console.log(row);

await client.end();
