/**
 * Writes prisma/cityCoords.json from REAL_CITIES for fetch_satellite_images.py
 */
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { REAL_CITIES } from "./realCitiesData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = REAL_CITIES.map(
  ({ continent, name, country, lat, lng, imageKey }) => ({
    continent,
    name,
    country,
    lat,
    lng,
    imageKey,
  })
);
const target = path.join(__dirname, "cityCoords.json");
writeFileSync(target, JSON.stringify(out, null, 2), "utf8");
console.log(`Wrote ${out.length} rows to ${target}`);
