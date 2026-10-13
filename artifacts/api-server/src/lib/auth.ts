import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import { UserModel } from "./models";

declare global {
  namespace Express {
    interface Request {
      authUserId?: string;
    }
  }
}

export function jwtSecret(): string | null {
  const secret = process.env.JWT_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

export function issueToken(userId: string): string | null {
  const secret = jwtSecret();
  if (!secret) return null;
  return jwt.sign({}, secret, { subject: userId, expiresIn: "7d", issuer: "rakla-api", audience: "rakla-store" });
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.get("authorization");
  const [scheme, token] = header?.split(" ") ?? [];
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    res.status(401).json({ error: "A valid Bearer token is required." });
    return;
  }
  const secret = jwtSecret();
  if (!secret) {
    res.status(503).json({ error: "JWT_SECRET is not configured on the server." });
    return;
  }
  try {
    const payload = jwt.verify(token, secret, { issuer: "rakla-api", audience: "rakla-store" });
    if (typeof payload === "string" || !payload.sub) {
      res.status(401).json({ error: "Invalid token." });
      return;
    }
    req.authUserId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

export async function publicUser(userId: string) {
  const user = await UserModel.findById(userId).select("displayName email createdAt").lean();
  return user ? { id: String(user._id), displayName: user.displayName, email: user.email, createdAt: user.createdAt } : null;
}
