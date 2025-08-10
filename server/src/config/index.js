import dotenv from "dotenv";
dotenv.config();

const cfg = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  llmProvider: (process.env.LLM_PROVIDER || "cohere").toLowerCase(),
  cohereKey: process.env.COHERE_API_KEY,
  cohereModel: process.env.COHERE_MODEL || "command-xlarge-nightly",
  openaiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  maxTokens: Number(process.env.MAX_TOKENS) || 800
};

export default cfg;
