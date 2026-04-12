import { Router } from "express";
import { continentValues } from "../schemas/quiz.schemas.js";

const LABELS = {
  AFRICA: "Africa",
  ANTARCTICA: "Antarctica",
  ASIA: "Asia",
  EUROPE: "Europe",
  NORTH_AMERICA: "North America",
  OCEANIA: "Oceania",
  SOUTH_AMERICA: "South America",
};

export const metaRouter = Router();

metaRouter.get("/continents", (req, res) => {
  const continents = continentValues.map((value) => ({
    value,
    label: LABELS[value] ?? value,
  }));
  res.json({ continents });
});
