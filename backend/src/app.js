import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiRouter } from "./routes/index.js";
import { pagesRouter } from "./routes/pages.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..");

const app = express();

const defaultPort = Number(process.env.PORT) || 3000;
const frontendOrigin =
  process.env.FRONTEND_ORIGIN || `http://localhost:${defaultPort}`;

app.set("view engine", "ejs");
app.set("views", path.join(repoRoot, "views"));

app.use(
  cors({
    origin: frontendOrigin === "*" ? true : frontendOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "200kb" }));
app.use(cookieParser());

app.use(express.static(path.join(repoRoot, "public")));
app.use("/services", express.static(path.join(repoRoot, "services")));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use(pagesRouter);
app.use("/api", apiRouter);

app.use(errorHandler);

export { app };
