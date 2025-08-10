import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { evaluateQuiz } from "../api/quizApi";

export default function Quiz() {
  const nav = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("currentQuiz");
    if (!raw) {
      nav("/");
      return;
    }
    setQuiz(JSON.parse(raw));
  }, [nav]);

  if (!quiz) return null;

  const { quizId, questions, answers: correctAnswers } = quiz;

  const onSelect = (qid, value) => {
    setUserAnswers((p) => ({ ...p, [qid]: value }));
  };

  const onSubmit = async () => {
    setErr(null);
    setSubmitting(true);
    try {
      const payload = { quizId, userAnswers, correctAnswers };
      const result = await evaluateQuiz(payload);
      sessionStorage.setItem("lastResult", JSON.stringify(result));
      nav("/result");
    } catch (error) {
      console.error(error);
      setErr(error.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h2 className="title">Quiz</h2>
        <div className="meta">Questions: {questions.length} • Quiz ID: {quizId}</div>

        <div className="questions">
          {questions.map((q, i) => (
            <div className="question" key={q.id}>
              <div className="q-text"><strong>{i + 1}.</strong> {q.question}</div>
              <div className="options">
                {q.options && q.options.length > 0 ? (
                  q.options.map((opt) => (
                    <label key={opt} className={`option ${userAnswers[q.id] === opt ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={userAnswers[q.id] === opt}
                        onChange={() => onSelect(q.id, opt)}
                      />
                      <span className="option-text">{opt}</span>
                    </label>
                  ))
                ) : (
                  <div className="no-options">No options provided.</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="actions">
          <button className="btn primary" onClick={onSubmit} disabled={submitting}>{submitting ? "Submitting..." : "Submit Quiz"}</button>
          <button className="btn ghost" onClick={() => { sessionStorage.removeItem("currentQuiz"); nav("/"); }}>Cancel</button>
        </div>
        {err && <div className="error">{err}</div>}
      </section>
    </main>
  );
}
