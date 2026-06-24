/**
 * Deploy to Vercel using VERCEL_TOKEN from .env.production.local
 * Usage: npm run deploy
 */
import { config } from "dotenv";
import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env.production.local");
if (!existsSync(envPath)) {
  console.error(
    "Missing .env.production.local — copy from .env.production.local.example and fill in values.",
  );
  process.exit(1);
}

config({ path: envPath });

const token = process.env.VERCEL_TOKEN?.trim();
if (!token) {
  console.error("VERCEL_TOKEN is empty in .env.production.local");
  process.exit(1);
}

const skipKeys = new Set([
  "VERCEL_TOKEN",
  "VERCEL_ORG_ID",
  "VERCEL_PROJECT_ID",
  "USE_LOCAL_UPLOADS",
]);

function run(cmd: string) {
  const safeCmd = token ? cmd.replace(token, "***") : cmd;
  console.log(`\n> ${safeCmd}\n`);
  execSync(cmd, { stdio: "inherit", env: process.env });
}

function pushEnvVars() {
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!key || skipKeys.has(key) || !value) continue;

    console.log(`Pushing env: ${key}`);
    try {
      execSync(
        `npx vercel env add ${key} production --force --token ${token}`,
        {
          stdio: ["pipe", "inherit", "inherit"],
          input: value,
          env: process.env,
        },
      );
    } catch {
      console.warn(`  (skipped or updated ${key})`);
    }
  }
}

try {
  if (!existsSync(path.join(process.cwd(), ".vercel", "project.json"))) {
    console.log("Linking Vercel project...");
    run(`npx vercel link --yes --token ${token}`);
  }

  console.log("Syncing environment variables to Vercel...");
  pushEnvVars();

  console.log("Deploying to production...");
  run(`npx vercel deploy --prod --yes --token ${token}`);
} catch (error) {
  console.error("Deploy failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
