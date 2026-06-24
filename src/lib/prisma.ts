import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_URL_NON_POOLING
  );
}

function createPrismaClient() {
  const rawConnectionString = resolveDatabaseUrl();

  if (!rawConnectionString) {
    throw new Error(
      "Database URL is not set. Configure DATABASE_URL or Vercel Postgres variables.",
    );
  }

  // Strip sslmode/ssl from URL so explicit ssl config below is authoritative.
  let connectionString = rawConnectionString;
  try {
    const url = new URL(rawConnectionString);
    url.searchParams.delete("sslmode");
    url.searchParams.delete("ssl");
    connectionString = url.toString();
  } catch {
    // If parsing fails, fall back to the raw string.
  }

  const adapter = new PrismaPg({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function toJson(value: unknown): string {
  return JSON.stringify(value);
}
