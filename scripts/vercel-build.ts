/**
 * Vercel production build: generate client, migrate DB, build Next.js.
 * Uses NODE_TLS_REJECT_UNAUTHORIZED=0 during migrate for Supabase pooler certs.
 */
import { execSync } from "child_process";

function resolveDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL
  );
}

function run(cmd: string, env?: Record<string, string>) {
  console.log(`\n> ${cmd}\n`);
  execSync(cmd, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

run("npx prisma generate");

const dbUrl = resolveDatabaseUrl();
if (!dbUrl || !dbUrl.startsWith("postgres")) {
  console.error(
    "Build aborted: set DATABASE_URL or Vercel Postgres (POSTGRES_URL) in Vercel Environment Variables.",
  );
  process.exit(1);
}

try {
  run("npx prisma migrate deploy", {
    NODE_TLS_REJECT_UNAUTHORIZED: "0",
  });
} catch {
  console.error("prisma migrate deploy failed — check DATABASE_URL / Postgres connectivity.");
  process.exit(1);
}

run("npx next build");
