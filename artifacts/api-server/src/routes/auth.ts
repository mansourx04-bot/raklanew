import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { GetMeResponse, LogInBody, LogInResponse, SignUpBody, SignUpResponse } from "@workspace/api-zod";
import { issueToken, publicUser, requireAuth } from "../lib/auth";
import { mongoReady } from "../lib/mongo";
import { UserModel } from "../lib/models";

const router: IRouter = Router();
const COST = 12;

function serviceUnavailable(res: Parameters<Parameters<IRouter["post"]>[1]>[1]) {
  res.status(503).json({ error: process.env.MONGODB_URI ? "MongoDB Atlas is temporarily unavailable." : "MONGODB_URI is not configured." });
}

router.post("/auth/signup", async (req, res): Promise<void> => {
  if (!mongoReady()) { serviceUnavailable(res); return; }
  const parsed = SignUpBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Please provide a valid name, email and password of at least 8 characters." }); return; }
  const displayName = parsed.data.displayName.trim();
  const email = parsed.data.email.trim().toLowerCase();
  if (displayName.length < 2) { res.status(400).json({ error: "Display name must contain at least 2 characters." }); return; }
  const existing = await UserModel.exists({ email });
  if (existing) { res.status(409).json({ error: "Email already registered." }); return; }
  const passwordHash = await bcrypt.hash(parsed.data.password, COST);
  let user;
  try {
    user = await UserModel.create({ displayName, email, passwordHash });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) { res.status(409).json({ error: "Email already registered." }); return; }
    throw err;
  }
  const token = issueToken(String(user._id));
  if (!token) { await UserModel.findByIdAndDelete(user._id); res.status(503).json({ error: "JWT_SECRET is not configured on the server." }); return; }
  res.status(201).json(SignUpResponse.parse({
    token,
    user: { id: String(user._id), displayName: user.displayName, email: user.email, createdAt: user.createdAt },
  }));
});

router.post("/auth/login", async (req, res): Promise<void> => {
  if (!mongoReady()) { serviceUnavailable(res); return; }
  const parsed = LogInBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Please enter a valid email and password." }); return; }
  const email = parsed.data.email.trim().toLowerCase();
  const user = await UserModel.findOne({ email }).select("+passwordHash");
  const valid = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !valid) { res.status(401).json({ error: "Email or password is incorrect." }); return; }
  const token = issueToken(String(user._id));
  if (!token) { res.status(503).json({ error: "JWT_SECRET is not configured on the server." }); return; }
  res.json(LogInResponse.parse({
    token,
    user: { id: String(user._id), displayName: user.displayName, email: user.email, createdAt: user.createdAt },
  }));
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  if (!mongoReady()) { serviceUnavailable(res); return; }
  const user = await publicUser(req.authUserId!);
  if (!user) { res.status(401).json({ error: "Account no longer exists." }); return; }
  res.json(GetMeResponse.parse(user));
});

export default router;
