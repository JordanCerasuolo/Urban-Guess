import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getProfileWithStats } from "../services/user.service.js";

export const userRouter = Router();

userRouter.get("/me/profile", requireAuth, async (req, res, next) => {
  try {
    const data = await getProfileWithStats(req.user.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});
