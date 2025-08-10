export const formatPrompt = ({ topic, numQuestions, questionType, context }) => {
  const safeTopic = topic || "General Knowledge";
  const safeNum = Number(numQuestions) || 5;
  const typeStr = questionType === "MCQ" ? "MCQ (exactly 4 options each)" : "ShortAnswer";

  return `You are a helpful quiz generator.
Generate exactly ${safeNum} ${typeStr} questions about "${safeTopic}".
${context ? "Additional context: " + context : ""}

Return only valid JSON with this shape:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "options": ["opt1","opt2","opt3","opt4"], // for MCQ
      "answer": "the exact correct option text"
    }
  ]
}

Do not include explanatory text. Return JSON only.`;
};
