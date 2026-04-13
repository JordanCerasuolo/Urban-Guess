/**
 * Load JPEGs from prisma/seed-images/{imageKey}.jpg into City rows.
 * Order: npm run prisma:seed -> node prisma/exportCoords.mjs -> python fetch -> npm run prisma:seed:images
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import { REAL_CITIES } from "./realCitiesData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();
const imagesDir = path.join(__dirname, "seed-images");

async function main() {
  let ok = 0;
  let missing = 0;

  for (const row of REAL_CITIES) {
    const file = path.join(imagesDir, `${row.imageKey}.jpg`);
    if (!fs.existsSync(file)) {
      console.warn(`Missing image: ${file}`);
      missing += 1;
      continue;
    }

    const buf = fs.readFileSync(file);
    await prisma.city.update({
      where: {
        uq_cities_continent_country_name: {
          continent: row.continent,
          country: row.country,
          name: row.name,
        },
      },
      data: {
        satelliteImageData: buf,
        satelliteImageMimeType: "image/jpeg",
      },
    });
    ok += 1;
    console.log(`Updated ${row.name} (${row.imageKey}.jpg)`);
  }

  console.log(`Done. ${ok} cities updated, ${missing} missing files.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
