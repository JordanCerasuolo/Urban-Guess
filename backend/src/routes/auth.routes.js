import { Router } from "express";
import {
  registerBodySchema,
  loginBodySchema,
} from "../schemas/auth.schemas.js";
import {
  registerUser,
  loginUser,
  getUserById,
  getCookieOptions,
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

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    res.json({ user });
  } catch (e) {
    next(e);
  }
});
