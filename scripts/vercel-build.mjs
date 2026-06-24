/**
 * Vercel production build — plain Node (no tsx required).
 */
import { execSync } from "child_process";

function resolveDatabaseUrl() {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL
  );
}

function run(cmd, extraEnv = {}) {
  console.log(`\n> ${cmd}\n`);
  execSync(cmd, {
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
}

const envFlags = {
  DATABASE_URL: Boolean(process.env.DATABASE_URL),
  POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
  POSTGRES_PRISMA_URL: Boolean(process.env.POSTGRES_PRISMA_URL),
  POSTGRES_URL_NON_POOLING: Boolean(process.env.POSTGRES_URL_NON_POOLING),
  NEXTAUTH_SECRET: Boolean(process.env.NEXTAUTH_SECRET),
  NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  SUPABASE_SERVICE_KEY: Boolean(process.env.SUPABASE_SERVICE_KEY),
};
console.log("Vercel build env check:", envFlags);

run("npx prisma generate");

const dbUrl = resolveDatabaseUrl();
if (dbUrl?.startsWith("postgres")) {
  try {
    run("npx prisma migrate deploy", { NODE_TLS_REJECT_UNAUTHORIZED: "0" });
  } catch {
    console.warn("prisma migrate deploy failed — continuing build (fix DB URL and redeploy).");
  }
} else {
  console.warn(
    "No Postgres URL at build time — skipping migrate deploy.\n" +
      "Add Vercel Postgres or DATABASE_URL, then Redeploy.",
  );
}

run("npx next build");
