import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import config from "./config/index.js";
import quizRoutes from "./api/routes/quiz.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Mount quiz API
app.use("/api/quiz", quizRoutes);

// Central error handler (last)
app.use(errorHandler);

const port = config.port || 5000;
app.listen(port, () => {
  console.log(`✅ AI-Quiz server listening on port ${port} (env=${config.nodeEnv})`);
});

// Export for testing or serverless
export default app;