import { seedDatabase } from "../src/lib/seed-database";
import { prisma } from "../src/lib/prisma";

async function main() {
  const result = await seedDatabase();
  console.log(result === "seeded" ? "Seed completed." : "Seed skipped: database already has data.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
