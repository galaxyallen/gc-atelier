/**
 * Validates env vars required for Vercel production deploy.
 * Usage: npm run deploy:check-env
 */
import "dotenv/config";

const required = [
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_KEY",
] as const;

const dbKeys = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
] as const;

const recommended = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_CURRENCY",
  "NEXT_PUBLIC_SHOP_CURRENCY",
] as const;

function check(keys: readonly string[], label: string) {
  const missing = keys.filter((k) => !process.env[k]?.trim());
  if (missing.length === 0) {
    console.log(`✓ ${label}: all set`);
    return true;
  }
  console.error(`✗ ${label} missing: ${missing.join(", ")}`);
  return false;
}

const okRequired = check(required, "Required");
const hasDb = dbKeys.some((k) => process.env[k]?.trim());
if (!hasDb) {
  console.error(
    "✗ Database URL missing: set DATABASE_URL or Vercel Postgres (POSTGRES_URL / POSTGRES_PRISMA_URL).",
  );
  process.exit(1);
} else {
  console.log("✓ Database URL: set");
}
const okRecommended = check(recommended, "Recommended (Stripe)");

if (!okRequired) {
  console.error("\nSet missing variables in Vercel → Project → Settings → Environment Variables.");
  process.exit(1);
}

if (!okRecommended) {
  console.warn("\nStripe vars missing — shop checkout will not work until configured.");
}

const dbUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  "";
if (!dbUrl.startsWith("postgres://") && !dbUrl.startsWith("postgresql://")) {
  console.error(
    "✗ DATABASE_URL must be a Postgres URL (Supabase). Local file: URLs are not valid for production.",
  );
  process.exit(1);
}

console.log("\nEnvironment looks ready for Vercel deploy.");
