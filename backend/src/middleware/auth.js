import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || "access_token";

function getToken(req) {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7);
  }
  if (req.cookies?.[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }
  return null;
}

/**
 * Attaches req.user if valid JWT; does not fail if missing.
 */
export function optionalAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token || !JWT_SECRET) {
      return next();
    }
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload?.sub) {
      req.user = { id: payload.sub };
    }
    return next();
  } catch {
    return next();
  }
}

/**
 * Requires valid JWT with sub (user id).
 */
export function requireAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token || !JWT_SECRET) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = { id: payload.sub };
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
