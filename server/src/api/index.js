// server/api/index.js
import express from "express";
import cors from "cors";
import quizRoutes from "./routes/quiz.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/quiz", quizRoutes);

export default app;
