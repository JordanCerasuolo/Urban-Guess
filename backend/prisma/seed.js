import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { normalizeAnswer } from "../src/lib/quizRules.js";

const prisma = new PrismaClient();

/** Minimal valid 1x1 PNG (transparent). */
const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

const CONTINENTS = [
  "AFRICA",
  "ANTARCTICA",
  "ASIA",
  "EUROPE",
  "NORTH_AMERICA",
  "OCEANIA",
  "SOUTH_AMERICA",
];

async function ensureMinCitiesPerContinent(min = 5) {
  for (const continent of CONTINENTS) {
    const count = await prisma.city.count({
      where: { continent, isActive: true },
    });
    for (let i = count; i < min; i++) {
      const name = `Demo ${continent} ${i + 1}`;
      const country = `DemoLand`;
      const normalizedAnswer = normalizeAnswer(name);
      await prisma.city.create({
        data: {
          continent,
          country,
          name,
          normalizedAnswer,
          description: "Seeded demo city.",
          hint1: "First hint for this demo city.",
          hint2: "Second hint for this demo city.",
          satelliteImageData: TINY_PNG,
          satelliteImageMimeType: "image/png",
          isActive: true,
        },
      });
    }
  }
}

async function main() {
  await ensureMinCitiesPerContinent(5);
  console.log("Seed complete: at least 5 active cities per continent.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
