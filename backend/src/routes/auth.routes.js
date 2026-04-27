import { Router } from "express";
import {
  registerBodySchema,
  loginBodySchema,
  resetPasswordBodySchema,
} from "../schemas/auth.schemas.js";
import {
  registerUser,
  loginUser,
  getUserById,
  getCookieOptions,
  requestPasswordReset,
  resetPassword,
} from "../services/auth.service.js";
import { requireAuth } from "../middleware/auth.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "access_token";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const body = registerBodySchema.parse(req.body);
    const { user } = await registerUser(body);
    // No cookie — user must verify email before they can log in
    res.status(201).json({ user });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const body = loginBodySchema.parse(req.body);
    const { user, token } = await loginUser(body);
    res.cookie(COOKIE_NAME, token, getCookieOptions());
    res.json({ user });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.status(204).end();
});

authRouter.post("/request-password-reset", async (req, res, next) => {
  try {
    const { email } = req.body;
    await requestPasswordReset(email);
    // Always return 200 — don't leak whether the email exists
    res.json({ message: "If that email is registered, a reset link has been sent." });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/reset-password", async (req, res, next) => {
  try {
    const body = resetPasswordBodySchema.parse(req.body);
    const result = await resetPassword(body.token, body.password);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    res.json({ message: "Password reset successfully." });
  } catch (e) {
    next(e);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    res.json({ user });
  } catch (e) {
    next(e);
  }
});
