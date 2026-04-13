import { z } from "zod";

export const continentValues = [
  "AFRICA",
  "ASIA",
  "EUROPE",
  "NORTH_AMERICA",
  "OCEANIA",
  "SOUTH_AMERICA",
  "ALL",
];

export const startQuizRunBodySchema = z.object({
  continent: z.enum(continentValues),
});

export const submitAnswerBodySchema = z.object({
  answer: z.string().min(1).max(150),
});

export const runIdParamSchema = z.object({
  runId: z.string().uuid(),
});

export const roundParamSchema = z.object({
  runId: z.string().uuid(),
  roundOrder: z.coerce.number().int().min(1).max(5),
});
