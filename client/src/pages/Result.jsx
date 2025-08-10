import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const nav = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("lastResult");
    if (!raw) {
      nav("/");
      return;
    }
    setResult(JSON.parse(raw));
  }, [nav]);

  if (!result) return null;

  const { score, total, quizId } = result;

  return (
    <main className="page">
      <section className="card center">
        <h2 className="title">Your Result</h2>
        <div className="big-score">{score} / {total}</div>
        <div className="meta">Quiz ID: {quizId}</div>

        <div className="actions">
          <button className="btn primary" onClick={() => { sessionStorage.removeItem("currentQuiz"); sessionStorage.removeItem("lastResult"); nav("/");}}>Take Another Quiz</button>
        </div>
      </section>
    </main>
  );
}
