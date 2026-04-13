import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(2).max(50),
});

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
