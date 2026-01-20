// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import importRoutes from "./routes/importRoutes.js";

// 👇 IMPORTANT: side-effect imports (no variables)
import "./cron.js";
import "./queues/jobWorker.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/import", importRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
