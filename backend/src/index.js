import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { pool } from "./pgClient.js";
import tasksRouter from "./routes/tasks.js";
import voiceRouter from "./routes/voice.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(500).json({ status: "error", message: "DB not reachable" });
  }
});

app.use("/api/tasks", tasksRouter);
app.use("/api/voice", voiceRouter);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});