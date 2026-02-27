import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { generate, save, list, getById } from "./designStudioController.js";

const router = Router();

router.post("/generate", authMiddleware, generate);
router.post("/save", authMiddleware, save);
router.get("/designs", authMiddleware, list);
router.get("/designs/:id", authMiddleware, getById);

export default router;
