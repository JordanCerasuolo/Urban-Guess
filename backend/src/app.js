import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const frontendOrigin = process.env.FRONTEND_ORIGIN || "*";

app.use(
  cors({
    origin: frontendOrigin === "*" ? true : frontendOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "200kb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", apiRouter);

app.use(errorHandler);

export { app };
