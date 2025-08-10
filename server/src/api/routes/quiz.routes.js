import express from "express";
import { body } from "express-validator";
import validateRequest from "../../middlewares/validate.middleware.js";
import { generateQuizHandler, evaluateQuizHandler } from "../../controllers/quiz.controller.js";

const router = express.Router();

router.post(
  "/generate",
  [
    body("topic").isString().trim().notEmpty().withMessage("topic is required"),
    body("numQuestions").isInt({ min: 1, max: 50 }).withMessage("numQuestions must be 1-50"),
    body("questionType").isIn(["MCQ", "ShortAnswer"]).withMessage("questionType must be MCQ or ShortAnswer"),
    body("context").optional().isString()
  ],
  validateRequest,
  generateQuizHandler
);

router.post(
  "/evaluate",
  [
    body("quizId").optional().isString(),
    body("userAnswers").isObject().withMessage("userAnswers must be an object"),
    body("correctAnswers").isObject().withMessage("correctAnswers must be an object")
  ],
  validateRequest,
  evaluateQuizHandler
);

export default router;
