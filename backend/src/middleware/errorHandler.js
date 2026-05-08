import { ZodError } from "zod";
import { AppError } from "../lib/appError.js";

/**
 * Express error-handling middleware (4 args).
 */
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: err.flatten(),
    });
  }

  if (err instanceof AppError) {
    const body = { message: err.message };
    if (err.code) body.code = err.code;
    return res.status(err.statusCode).json(body);
  }

  const code = err?.code;
  if (code === "P2002") {
    const fields = err?.meta?.target;
    console.log(fields);
    if (fields.includes('email')) {
      return res.status(409).json({ message: "Email is already in use, please log into your account." });
    } else if (fields.includes('username')) {
      return res.status(409).json({ message: "Username is already in use, please try another." });
    } else {
      return res.status(409).json({ message: "Unkown unique constraint violation." });
    }
  }
  if (code === "P2025") {
    return res.status(404).json({ message: "Record not found" });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}
