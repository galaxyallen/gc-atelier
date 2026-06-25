/**
 * Ensure default admin exists in production DB (uses Vercel POSTGRES_URL).
 * Usage: npm run ensure:admin
 */
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import pg from "pg";

config({ path: ".env.production.local" });

const { Client } = pg;
const TOKEN = process.env.VERCEL_TOKEN?.trim();
const TEAM = process.env.VERCEL_TEAM_SLUG?.trim() || "allens-projects-6acbb418";
const PROJECT = process.env.VERCEL_PROJECT?.trim() || "gc-atelier";
const ADMIN_EMAIL = "admin@gcatelier.com";
const ADMIN_PASSWORD = "admin123";

async function vercelApi(pathname) {
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
    (e) => e.key === "POSTGRES_URL" && e.target?.includes("production"),
  );
  if (!pgEnv) throw new Error("POSTGRES_URL not found on Vercel");
  const detail = await vercelApi(
    `/v9/projects/${PROJECT}/env/${pgEnv.id}?decrypt=true`,
  );
  return detail.value;
}

async function main() {
  if (!TOKEN) {
    console.error("VERCEL_TOKEN required in .env.production.local");
    process.exit(1);
  }

  const connectionString = await getPostgresUrl();
  let url = connectionString;
  try {
    const parsed = new URL(connectionString);
    parsed.searchParams.delete("sslmode");
    parsed.searchParams.delete("ssl");
    url = parsed.toString();
  } catch {
    // keep raw string
  }

  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    const { rows } = await client.query(
      'SELECT email, role FROM "AdminUser" ORDER BY "createdAt"',
    );
    console.log(`Found ${rows.length} admin user(s)`);
    for (const a of rows) console.log(`  - ${a.email} (${a.role})`);

    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const existing = await client.query(
      'SELECT id FROM "AdminUser" WHERE email = $1',
      [ADMIN_EMAIL],
    );

    if (existing.rowCount > 0) {
      await client.query(
        'UPDATE "AdminUser" SET password = $1, role = $2, "updatedAt" = NOW() WHERE email = $3',
        [hash, "SUPER_ADMIN", ADMIN_EMAIL],
      );
      console.log(`Reset password for ${ADMIN_EMAIL}`);
    } else {
      const id = `admin_${Date.now().toString(36)}`;
      await client.query(
        `INSERT INTO "AdminUser" (id, email, name, password, role, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [id, ADMIN_EMAIL, "Admin", hash, "SUPER_ADMIN"],
      );
      console.log(`Created ${ADMIN_EMAIL}`);
    }

    const verify = await client.query(
      'SELECT password FROM "AdminUser" WHERE email = $1',
      [ADMIN_EMAIL],
    );
    const ok = await bcrypt.compare(ADMIN_PASSWORD, verify.rows[0].password);
    console.log(ok ? "✓ Password verified" : "✗ Password verify failed");
    console.log(`\nLogin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    console.log("Change password after first login.");
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
