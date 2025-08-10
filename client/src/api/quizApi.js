const API_BASE = import.meta.env.VITE_API_BASE || "";

async function request(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, opts);
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!res.ok) throw new Error(json.error || JSON.stringify(json));
    return json;
  } catch (e) {
    if (!res.ok) throw new Error(text || "Network error");
    return JSON.parse(text);
  }
}

export async function generateQuiz(payload) {
  return request("/api/quiz/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function evaluateQuiz(payload) {
  return request("/api/quiz/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
