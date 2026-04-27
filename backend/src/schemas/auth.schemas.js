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

// confirmPassword matching is handled client-side (same pattern as register)
export const resetPasswordBodySchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});
