import { Router } from "express";
import {
  verifyUserByToken,
  refreshVerificationToken,
} from "../services/auth.service.js";
import { sendVerificationEmail } from "../services/email.service.js";

export const pagesRouter = Router();

pagesRouter.get("/", (req, res) => {
  res.render("home", { user: null });
});

pagesRouter.get("/login", (req, res) => {
  res.render("login", { error: undefined });
});

pagesRouter.get("/signup", (req, res) => {
  res.render("signup", { error: undefined });
});

pagesRouter.get("/games", (req, res) => {
  res.render("games");
});

pagesRouter.get("/game", (req, res) => {
  res.render("game");
});

pagesRouter.get("/leaderboard", (req, res) => {
  res.render("leaderboard");
});

pagesRouter.get("/profile", (req, res) => {
  res.render("profile");
});

// ─── Password Reset ─────────────────────────────────────────────────────────

pagesRouter.get("/change-password", (req, res) => {
  res.render("changepassword");
});

pagesRouter.get("/reset-password/:token", (req, res) => {
  res.render("resetpassword", { token: req.params.token });
});

// ─── Verification ────────────────────────────────────────────────────────────

pagesRouter.get("/verify-email", (req, res) => {
  const email = req.query.email || "";
  const verified = req.query.verified === "true";
  res.render("verifyemail", { email, verified });
});

pagesRouter.get("/verify/:token", async (req, res) => {
  try {
    const result = await verifyUserByToken(req.params.token);
    if (result.error) {
      return res.render("login", { error: result.error });
    }
    res.redirect("/verify-email?verified=true");
  } catch (error) {
    res.render("login", { error: "Error verifying email." });
  }
});

pagesRouter.get("/resend-verification", async (req, res) => {
  const email = req.query.email;
  try {
    const token = await refreshVerificationToken(email);
    if (token) {
      await sendVerificationEmail(email, token);
    }
    res.redirect(`/verify-email?email=${encodeURIComponent(email)}`);
  } catch (error) {
    res.redirect(`/verify-email?email=${encodeURIComponent(email)}`);
  }
});
