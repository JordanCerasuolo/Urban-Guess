import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/appError.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email.service.js";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

function signToken(userId) {
  if (!JWT_SECRET) {
    throw new AppError(500, "JWT_SECRET is not configured");
  }
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function getCookieOptions() {
  const maxAge = parseExpiresToMs(JWT_EXPIRES_IN);
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge,
    path: "/",
  };
}

function parseExpiresToMs(exp) {
  const m = String(exp).match(/^(\d+)([smhd])$/i);
  if (!m) return 24 * 60 * 60 * 1000;
  const n = Number(m[1]);
  const u = m[2].toLowerCase();
  if (u === "s") return n * 1000;
  if (u === "m") return n * 60 * 1000;
  if (u === "h") return n * 60 * 60 * 1000;
  if (u === "d") return n * 24 * 60 * 60 * 1000;
  return 24 * 60 * 60 * 1000;
}

/**
 * @param {{ email: string, password: string, username: string }} input
 */
export async function registerUser(input) {
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      passwordHash,
      verificationToken,
      verificationExpiresAt,
    },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      verificationToken: true,
    },
  });
  // Send verification email before returning
  await sendVerificationEmail(user.email, user.verificationToken);
  return { user };
}

/**
 * @param {{ email: string, password: string }} input
 */
export async function loginUser(input) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) {
    throw new AppError(401, "Invalid email or password");
  }
  if (!user.isVerified) {
    throw new AppError(403, "Please verify your email before logging in.");
  }
  const token = signToken(user.id);
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    },
  };
}

/**
 * @param {string} token
 */
export async function verifyUserByToken(token) {
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });
  if (!user) return { error: "Invalid verification link." };
  if (new Date() > new Date(user.verificationExpiresAt)) {
    return { error: "Verification link has expired. Please sign up again." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationExpiresAt: null,
    },
  });
  return { success: true };
}

/**
 * @param {string} email
 */
export async function refreshVerificationToken(email) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const result = await prisma.user.updateMany({
    where: { email, isVerified: false },
    data: {
      verificationToken: token,
      verificationExpiresAt: expiresAt,
    },
  });
  return result.count > 0 ? token : null;
}

/**
 * @param {string} email
 */
export async function requestPasswordReset(email) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const result = await prisma.user.updateMany({
    where: { email, isVerified: true },
    data: {
      verificationToken: token,
      verificationExpiresAt: expiresAt,
    },
  });
  if (result.count > 0) {
    await sendPasswordResetEmail(email, token);
  }
  return result.count > 0 ? token : null;
}

/**
 * @param {string} token
 * @param {string} newPassword
 */
export async function resetPassword(token, newPassword) {
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });
  if (!user) return { error: "Invalid reset link." };
  if (new Date() > new Date(user.verificationExpiresAt)) {
    return { error: "Reset link has expired. Please try again." };
  }
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      verificationToken: null,
      verificationExpiresAt: null,
    },
  });
  return { success: true };
}

/**
 * @param {string} userId
 */
export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
}
