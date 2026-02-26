import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId?: mongoose.Types.ObjectId;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: "Server misconfiguration" });
    return;
  }
  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    req.userId = new mongoose.Types.ObjectId(decoded.userId);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
