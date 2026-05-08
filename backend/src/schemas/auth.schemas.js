import { z } from "zod";


// passwords should contain at least 8 characters, including at least one uppercase, lowercase, number, and special
const passwordRules = z
  .string()
  .min(8)
  .max(72) // bcrypt has a 72 character limit
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")



export const registerBodySchema = z.object({
  email: z.string().email(),
  password: passwordRules,
  username: z.string().min(2).max(50),
});

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// confirmPassword matching is handled client-side (same pattern as register)
export const resetPasswordBodySchema = z.object({
  token: z.string().min(1),
  password: passwordRules,
});
