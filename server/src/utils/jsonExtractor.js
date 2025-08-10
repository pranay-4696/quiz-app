export const extractJsonFromText = (text) => {
  if (!text || typeof text !== "string") return null;

  try {
    JSON.parse(text);
    return text;
  } catch {}

  const objectMatch = text.match(/\{[\s\S]*\}/);
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  const candidate = objectMatch?.[0] || arrayMatch?.[0];
  if (!candidate) return null;

  const cleaned = candidate.replace(/```json|```/g, "").trim();
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    return null;
  }
};
