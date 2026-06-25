/**
 * Clear built-in SVG placeholders from Project.image and set real cover from gallery.
 * Usage: node scripts/fix-project-cover-images.mjs
 */
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.production.local" });

const PLACEHOLDER = /^\/images\/projects\/[a-z]+\.svg$/i;

function isRealImage(v) {
  const s = v?.trim();
  if (!s) return false;
  if (PLACEHOLDER.test(s)) return false;
  return s.startsWith("/") || s.startsWith("http://") || s.startsWith("https://");
}

function firstGalleryUrl(galleryJson) {
  try {
    const arr = JSON.parse(galleryJson || "[]");
    if (!Array.isArray(arr)) return null;
    for (const item of arr) {
      if (isRealImage(item)) return item.trim();
    }
  } catch {
    /* ignore */
  }
  return null;
}

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
let conn = detail.value;
try {
  const parsed = new URL(conn);
  parsed.searchParams.delete("sslmode");
  parsed.searchParams.delete("ssl");
  conn = parsed.toString();
} catch {
  /* keep */
}

const client = new pg.Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
await client.connect();

const rows = await client.query(`SELECT id, name, image, gallery FROM "Project"`);
let updated = 0;

for (const row of rows.rows) {
  const fromGallery = firstGalleryUrl(row.gallery);
  let newImage = row.image;

  if (PLACEHOLDER.test(row.image?.trim() ?? "") || !isRealImage(row.image)) {
    newImage = fromGallery ?? null;
  }

  if (newImage !== row.image) {
    await client.query(`UPDATE "Project" SET image = $1, "updatedAt" = NOW() WHERE id = $2`, [
      newImage,
      row.id,
    ]);
    console.log("→", row.name, "image:", row.image, "→", newImage ?? "(null)");
    updated++;
  }
}

console.log(`\nDone. Updated ${updated} project(s).`);
await client.end();
