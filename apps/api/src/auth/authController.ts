import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import mongoose from "mongoose";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function signUp(req: Request, res: Response): Promise<void> {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    return;
  }
  const { email, password, name } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ message: "Email already registered" });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: "Server misconfiguration" });
    return;
  }
  const token = jwt.sign(
    { userId: (user._id as mongoose.Types.ObjectId).toString() },
    secret,
    { expiresIn: "7d" }
  );
  res.status(201).json({
    token,
    user: { id: (user._id as mongoose.Types.ObjectId).toString(), email: user.email, name: user.name },
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    return;
  }
  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: "Server misconfiguration" });
    return;
  }
  const token = jwt.sign(
    { userId: (user._id as mongoose.Types.ObjectId).toString() },
    secret,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: { id: (user._id as mongoose.Types.ObjectId).toString(), email: user.email, name: user.name },
  });
}

export async function me(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  const user = await User.findById(req.userId).select("-passwordHash");
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json({
    user: {
      id: (user._id as mongoose.Types.ObjectId).toString(),
      email: user.email,
      name: user.name,
    },
  });
}
