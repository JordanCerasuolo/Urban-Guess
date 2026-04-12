import { Router } from "express";

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
