import { Router } from "express";
import { signUp, login, me } from "./authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router;
