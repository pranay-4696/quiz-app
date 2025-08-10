const store = new Map();

export const createId = () => `quiz_${Date.now()}_${Math.floor(Math.random()*1000)}`;

export const saveQuiz = ({ quizId, questions, answers }) => {
  store.set(quizId, { quizId, questions, answers, createdAt: Date.now() });
};

export const getQuiz = (quizId) => {
  return store.get(quizId) || null;
};

export const clear = () => store.clear();
