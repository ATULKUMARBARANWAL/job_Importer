import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import importRoutes from "./routes/importRoutes.js";

// side effects
import "./cron.js";
import "./queues/jobWorker.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
 origin: process.env.CLIENT_URL || "http://localhost:3000",
  },
});

// 🔥 Make io accessible globally
global.io = io;

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(cors());

app.use("/api/import", importRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
