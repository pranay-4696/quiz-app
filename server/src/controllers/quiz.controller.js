import * as quizService from "../services/quiz.service.js";

export const generateQuizHandler = async (req, res, next) => {
  try {
    const { topic, numQuestions, questionType, context } = req.body;
    const result = await quizService.generateQuiz({ topic, numQuestions, questionType, context });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const evaluateQuizHandler = async (req, res, next) => {
  try {
    const { quizId, userAnswers, correctAnswers } = req.body;
    const result = quizService.evaluateQuiz({ quizId, userAnswers, correctAnswers });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
