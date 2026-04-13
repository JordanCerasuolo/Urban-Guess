import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { normalizeAnswer } from "../src/lib/quizRules.js";
import { REAL_CITIES } from "./realCitiesData.js";

const prisma = new PrismaClient();

/**
 * Clears quiz data and all cities; leaves users intact.
 * Optional hard reset: delete prisma/dev.db, then `npx prisma db push` and run this seed (drops users too).
 */
async function clearQuizDataAndCities() {
  await prisma.roundSubmission.deleteMany();
  await prisma.quizRound.deleteMany();
  await prisma.quizRun.deleteMany();
  await prisma.city.deleteMany();
}

async function seedRealCities() {
  for (const row of REAL_CITIES) {
    await prisma.city.create({
      data: {
        continent: row.continent,
        name: row.name,
        country: row.country,
        normalizedAnswer: normalizeAnswer(row.name),
        description: row.description,
        hint1: row.hint1,
        hint2: row.hint2,
        isActive: true,
        satelliteImageData: null,
        satelliteImageMimeType: null,
      },
    });
  }
}

async function main() {
  await clearQuizDataAndCities();
  await seedRealCities();
  console.log(
    `Seed complete: ${REAL_CITIES.length} cities (text + hints). Users preserved; quiz history cleared.`
  );
  console.warn(
    "Satellite images are not set — round image API will 404 until you add a separate image seed."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
