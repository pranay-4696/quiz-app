import config from "../config/index.js";
import { formatPrompt } from "../utils/promptFormatter.js";
import { extractJsonFromText } from "../utils/jsonExtractor.js";
import * as llmProvider from "../providers/llm.provider.js";
import * as repo from "../repositories/quiz.repository.js";

export const generateQuiz = async ({ topic, numQuestions, questionType, context }) => {
  const prompt = formatPrompt({ topic, numQuestions, questionType, context });

  const raw = await llmProvider.generateFromPrompt(prompt);

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const jsonText = extractJsonFromText(raw);
    if (!jsonText) throw new Error("LLM did not return valid JSON");
    parsed = JSON.parse(jsonText);
  }

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error("Parsed LLM output missing questions array");
  }

  const quizId = repo.createId();
  const answers = {};
  const questions = parsed.questions.map((q, idx) => {
    const id = q.id || `q${idx + 1}`;
    answers[id] = q.answer;
    return {
      id,
      question: q.question,
      options: q.options || []
    };
  });

  repo.saveQuiz({ quizId, questions, answers });

  return { quizId, questions, answers };
};

export const evaluateQuiz = ({ quizId, userAnswers = {}, correctAnswers = {} }) => {
  let correct = correctAnswers;
  if ((!correct || Object.keys(correct).length === 0) && quizId) {
    const stored = repo.getQuiz(quizId);
    if (stored) correct = stored.answers || {};
  }

  const total = Object.keys(correct).length;
  let score = 0;
  for (const qid of Object.keys(correct)) {
    if (userAnswers[qid] && userAnswers[qid] === correct[qid]) score++;
  }
  return { quizId, score, total };
};
