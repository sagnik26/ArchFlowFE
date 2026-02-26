import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import { authMiddleware } from "./middleware/auth.js";
import authRoutes from "./auth/authRoutes.js";
import hldRoutes from "./hld/hldRoutes.js";
import { generate as hldGenerate } from "./hld/hldController.js";
import dbRoutes from "./db/dbRoutes.js";
import lldRoutes from "./lld/lldRoutes.js";
import designStudioRoutes from "./designStudio/designStudioRoutes.js";

const PORT = process.env.PORT ?? 3001;
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/hld", hldRoutes);
app.post("/api/v1/diagram", authMiddleware, hldGenerate);
app.use("/api/v1/db", dbRoutes);
app.use("/api/v1/lld", lldRoutes);
app.use("/api/v1/design-studio", designStudioRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
