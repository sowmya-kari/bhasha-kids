"use client";

import { useMemo, useState } from "react";
import "./math-corner.css";

type Operation = "add" | "subtract" | "multiply" | "divide";
type Language = "Telugu" | "Hindi";

const labels: Record<Language, Record<Operation, string>> = {
  Telugu: { add: "కూడిక", subtract: "తీసివేత", multiply: "గుణకారం", divide: "భాగహారం" },
  Hindi: { add: "जोड़", subtract: "घटाव", multiply: "गुणा", divide: "भाग" },
};

function makeQuestion(operation: Operation) {
  let a = Math.floor(Math.random() * 9) + 1;
  let b = Math.floor(Math.random() * 9) + 1;
  if (operation === "subtract" && b > a) [a, b] = [b, a];
  if (operation === "divide") {
    b = Math.floor(Math.random() * 8) + 1;
    const answer = Math.floor(Math.random() * 8) + 1;
    a = b * answer;
  }
  const answer = operation === "add" ? a + b : operation === "subtract" ? a - b : operation === "multiply" ? a * b : a / b;
  const symbol = operation === "add" ? "+" : operation === "subtract" ? "−" : operation === "multiply" ? "×" : "÷";
  return { a, b, answer, symbol };
}

export default function MathCorner() {
  const [language, setLanguage] = useState<Language>("Telugu");
  const [operation, setOperation] = useState<Operation>("add");
  const [question, setQuestion] = useState(() => makeQuestion("add"));
  const [choice, setChoice] = useState<number | null>(null);

  const answers = useMemo(() => {
    const set = new Set<number>([question.answer]);
    while (set.size < 4) set.add(Math.max(0, question.answer + Math.floor(Math.random() * 9) - 4));
    return [...set].sort(() => Math.random() - .5);
  }, [question]);

  function chooseOperation(next: Operation) {
    setOperation(next);
    setQuestion(makeQuestion(next));
    setChoice(null);
  }

  function nextQuestion() {
    setQuestion(makeQuestion(operation));
    setChoice(null);
  }

  const correct = choice === question.answer;

  return (
    <section className="math-corner" id="math-corner">
      <div className="math-heading">
        <div><small>NEW · PLAY AND LEARN</small><h2>Math Corner</h2><p>Every round uses different numbers for addition, subtraction, multiplication, and division.</p></div>
        <div className="math-language"><button className={language === "Telugu" ? "active" : ""} onClick={() => setLanguage("Telugu")}>తెలుగు</button><button className={language === "Hindi" ? "active" : ""} onClick={() => setLanguage("Hindi")}>हिन्दी</button></div>
      </div>

      <div className="math-operations">
        {(["add","subtract","multiply","divide"] as Operation[]).map((item) => <button key={item} className={operation === item ? "active" : ""} onClick={() => chooseOperation(item)}><span>{item === "add" ? "+" : item === "subtract" ? "−" : item === "multiply" ? "×" : "÷"}</span><b>{labels[language][item]}</b></button>)}
      </div>

      <div className="math-board">
        <div className="math-question"><small>SOLVE IT</small><strong>{question.a} {question.symbol} {question.b} = ?</strong></div>
        <div className="math-answers">{answers.map((answer) => <button key={answer} className={choice === answer ? (answer === question.answer ? "correct" : "wrong") : ""} onClick={() => setChoice(answer)}>{answer}</button>)}</div>
        <div className={`math-feedback ${choice !== null ? "show" : ""}`}>{choice === null ? "" : correct ? (language === "Telugu" ? "చాలా బాగా చేశావు! 🎉" : "बहुत बढ़िया! 🎉") : (language === "Telugu" ? "మళ్లీ ప్రయత్నించు" : "फिर से कोशिश करो")}</div>
        {correct && <button className="math-next" onClick={nextQuestion}>Next question →</button>}
      </div>
    </section>
  );
}
