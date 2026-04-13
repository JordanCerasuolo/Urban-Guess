import { Router } from "express";
import { continentValues } from "../schemas/quiz.schemas.js";
import { getGlobalLeaderboard } from "../services/leaderboard.service.js";

const LABELS = {
  AFRICA: "Africa",
  ASIA: "Asia",
  EUROPE: "Europe",
  NORTH_AMERICA: "North America",
  OCEANIA: "Oceania",
  SOUTH_AMERICA: "South America",
  ALL: "Everywhere",
};

export const metaRouter = Router();

metaRouter.get("/continents", (req, res) => {
  const continents = continentValues.map((value) => ({
    value,
    label: LABELS[value] ?? value,
  }));
  res.json({ continents });
});

metaRouter.get("/leaderboard", async (req, res, next) => {
  try {
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const rows = await getGlobalLeaderboard(limit);
    res.json({ rows });
  } catch (e) {
    next(e);
  }
});
