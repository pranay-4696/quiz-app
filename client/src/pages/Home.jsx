import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuiz } from "../api/quizApi";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const payload = {
        topic: topic || "General Knowledge",
        numQuestions: Number(numQuestions) || 5,
        questionType: "MCQ",
        context: context || ""
      };
      const data = await generateQuiz(payload);
      sessionStorage.setItem("currentQuiz", JSON.stringify(data));
      nav("/quiz");
    } catch (error) {
      console.error(error);
      setErr(error.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h1 className="title">IntelliQuiz — Quick Quiz</h1>

        <form onSubmit={onSubmit} className="form">
          <label className="label">
            Topic
            <input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Strings in Java or Cricket" />
          </label>

          <label className="label">
            Number of Questions
            <input className="input" type="number" min="1" max="50" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} />
          </label>

          <label className="label">
            Additional Context (optional)
            <textarea className="textarea" value={context} onChange={(e) => setContext(e.target.value)} placeholder="Add context to refine questions"></textarea>
          </label>

          <div className="actions">
            <button className="btn primary" disabled={loading}>{loading ? "Generating..." : "Generate Quiz"}</button>
            <button type="button" className="btn ghost" onClick={() => { setTopic(""); setNumQuestions(5); setContext(""); }}>Reset</button>
          </div>

          {err && <div className="error">{err}</div>}
        </form>
      </section>
    </main>
  );
}
