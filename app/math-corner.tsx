"use client";

import { useEffect, useState } from "react";
import "./math-corner.css";
import { BuddyTip } from "./BuddyTip";

type Language = "Telugu" | "Hindi";

type FruitEquation = { op: "add" | "sub"; a: number; b: number; result: number; fruit: string };
const fruitEquations: FruitEquation[] = [
  { op: "add", a: 1, b: 1, result: 2, fruit: "🍊" },
  { op: "add", a: 1, b: 2, result: 3, fruit: "🥕" },
  { op: "add", a: 2, b: 2, result: 4, fruit: "🍎" },
  { op: "add", a: 2, b: 3, result: 5, fruit: "🍆" },
  { op: "add", a: 3, b: 3, result: 6, fruit: "🍇" },
  { op: "add", a: 3, b: 4, result: 7, fruit: "🌽" },
  { op: "add", a: 3, b: 5, result: 8, fruit: "🍓" },
  { op: "add", a: 3, b: 6, result: 9, fruit: "🥦" },
  { op: "sub", a: 3, b: 1, result: 2, fruit: "🍊" },
  { op: "sub", a: 4, b: 1, result: 3, fruit: "🥕" },
  { op: "sub", a: 4, b: 2, result: 2, fruit: "🍎" },
  { op: "sub", a: 5, b: 2, result: 3, fruit: "🍆" },
  { op: "sub", a: 6, b: 3, result: 3, fruit: "🍇" },
  { op: "sub", a: 7, b: 3, result: 4, fruit: "🌽" },
  { op: "sub", a: 8, b: 3, result: 5, fruit: "🍓" },
  { op: "sub", a: 9, b: 4, result: 5, fruit: "🥦" },
];
function fruitShuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function fruitMathOptions(result: number): number[] {
  const deltas = [-2, -1, 1, 2];
  const candidates = fruitShuffle([...new Set(deltas.map((d) => result + d).filter((v) => v > 0 && v !== result))]).slice(0, 3);
  return fruitShuffle([result, ...candidates]);
}

function FruitMathGame() {
  const [language, setLanguage] = useState<Language>("Telugu");
  const [phase, setPhase] = useState<"start" | "play" | "end">("start");
  const [order, setOrder] = useState<FruitEquation[]>(fruitEquations);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [locked, setLocked] = useState(false);
  const [shake, setShake] = useState(false);
  const [revealCorrect, setRevealCorrect] = useState(false);
  const [pickedValue, setPickedValue] = useState<number | null>(null);

  function startGame() {
    const shuffledOrder = fruitShuffle(fruitEquations);
    setOrder(shuffledOrder); setIndex(0); setScore(0); setPhase("play"); setFeedback(null); setLocked(false); setShake(false); setRevealCorrect(false); setPickedValue(null);
    setOptions(fruitMathOptions(shuffledOrder[0].result));
  }
  function pick(value: number) {
    if (locked) return;
    setLocked(true); setPickedValue(value);
    const current = order[index];
    if (value === current.result) {
      setScore((s) => s + 1);
      setFeedback({ ok: true, text: language === "Telugu" ? "సరైనది! 🎉" : "सही! 🎉" });
    } else {
      setShake(true); setRevealCorrect(true);
      setFeedback({ ok: false, text: (language === "Telugu" ? "ఓహో! సరైన సమాధానం: " : "ओह! सही उत्तर है: ") + current.result });
    }
    window.setTimeout(() => {
      setFeedback(null); setLocked(false); setShake(false); setRevealCorrect(false); setPickedValue(null);
      const nextIndex = index + 1;
      if (nextIndex >= order.length) setPhase("end");
      else { setIndex(nextIndex); setOptions(fruitMathOptions(order[nextIndex].result)); }
    }, 1200);
  }

  const stars = score >= 14 ? 3 : score >= 10 ? 2 : 1;
  const current = order[index];
  return (
    <div className="fruit-math-game">
      <div className="fruit-math-head"><div><small>PRACTICE · FRUIT MATH</small><h3>Fruit <em>Equation</em> Practice</h3><p>Count the fruit, solve the equation, and tap the matching answer.</p><BuddyTip name="vageesh" message="I love puzzles like this — let's play!" /></div><b>⭐ {score}/{fruitEquations.length}</b></div>
      <div className="fruit-math-lang" role="group" aria-label="Choose language"><button className={language === "Telugu" ? "active" : ""} onClick={() => setLanguage("Telugu")}>తెలుగు</button><button className={language === "Hindi" ? "active" : ""} onClick={() => setLanguage("Hindi")}>हिन्दी</button></div>
      {phase === "start" && <div className="fruit-math-start"><button className="fruit-math-primary" onClick={startGame}>{language === "Telugu" ? "ఆట మొదలుపెట్టండి" : "खेल शुरू करें"}</button></div>}
      {phase === "play" && current && <>
        <div className="fruit-math-progress">{language === "Telugu" ? "అంశం" : "विषय"} {index + 1}/{order.length} <span className={`fruit-math-op-badge ${current.op}`}>{current.op === "add" ? (language === "Telugu" ? "కూడిక" : "जोड़") : (language === "Telugu" ? "తీసివేత" : "घटाव")}</span></div>
        <div className={`fruit-math-card${shake ? " shake" : ""}`}><div className="fruit-math-row"><span className="fruit-math-group">{current.fruit.repeat(current.a)}</span><span className="fruit-math-op">{current.op === "add" ? "+" : "−"}</span><span className="fruit-math-group">{current.fruit.repeat(current.b)}</span><span className="fruit-math-op">=</span><span className="fruit-math-question">?</span></div></div>
        <div className="fruit-math-options">{options.map((value) => { const showCorrect = revealCorrect && value === current.result; const showWrong = pickedValue === value && value !== current.result; return <button key={value} className={`fruit-math-option${showCorrect ? " correct" : ""}${showWrong ? " wrong" : ""}`} disabled={locked} onClick={() => pick(value)}><span className="fruit-math-option-fruits">{current.fruit.repeat(value)}</span><b>{value}</b></button>; })}</div>
        <div className={`fruit-math-feedback${feedback ? (feedback.ok ? " ok" : " no") : ""}`} aria-live="polite">{feedback?.text}</div>
      </>}
      {phase === "end" && <div className="fruit-math-end"><span className="fruit-math-end-emoji">{score >= 14 ? "🏆" : score >= 10 ? "🎉" : "🌱"}</span><div className="fruit-math-stars">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div><b>{(language === "Telugu" ? "మీ స్కోరు: " : "आपका स्कोर: ") + score + "/" + fruitEquations.length}</b><button className="fruit-math-primary" onClick={startGame}>{language === "Telugu" ? "మళ్లీ ఆడండి" : "फिर से खेलें"}</button></div>}
    </div>
  );
}

type CompareSize = "small" | "medium" | "big";
type MoreRound = { kind: "more"; emoji: string; a: number; b: number };
type SizeRound = { kind: "size"; emoji: string };
type SortRound = { kind: "sort"; emoji: string; order: CompareSize[] };
type CompareRound = MoreRound | SizeRound | SortRound;

const compareObjects = ["🎈", "🍎", "🐘", "⭐", "🌸", "🍇", "🦋", "🐝"];
const compareLabels: Record<Language, { title: string; subtitle: string; start: string; playAgain: string; moreQuestion: string; sizeInstruction: string; sortInstruction: string; big: string; small: string }> = {
  Telugu: { title: "పోల్చు & సర్దు", subtitle: "ఎక్కువ ఏది? పెద్దది-చిన్నది? సైజు ప్రకారం సర్దండి!", start: "ఆట మొదలుపెట్టండి", playAgain: "మళ్లీ ఆడండి", moreQuestion: "ఎక్కువ ఉన్న గుంపును నొక్కండి!", sizeInstruction: "పెద్దది, చిన్నది — సరైన పెట్టెలో ఉంచండి", sortInstruction: "చిన్నది నుండి పెద్దది వరకు నొక్కండి", big: "పెద్దది", small: "చిన్నది" },
  Hindi: { title: "तुलना और क्रम", subtitle: "ज़्यादा कौन सा? बड़ा-छोटा? आकार के अनुसार सजाएँ!", start: "खेल शुरू करें", playAgain: "फिर से खेलें", moreQuestion: "ज़्यादा वाले समूह पर टैप करें!", sizeInstruction: "बड़ा, छोटा — सही डिब्बे में रखें", sortInstruction: "छोटे से बड़े तक टैप करें", big: "बड़ा", small: "छोटा" },
};

function buildCompareRounds(): CompareRound[] {
  const kinds: CompareRound["kind"][] = ["more", "size", "sort", "more", "size", "sort", "more", "size", "sort"];
  const objs = fruitShuffle(compareObjects);
  return kinds.map((kind, i) => {
    const emoji = objs[i % objs.length];
    if (kind === "more") {
      let a = 2 + Math.floor(Math.random() * 3);
      let b = 2 + Math.floor(Math.random() * 3);
      while (b === a) b = 2 + Math.floor(Math.random() * 3);
      return { kind, emoji, a, b };
    }
    if (kind === "sort") return { kind, emoji, order: fruitShuffle<CompareSize>(["small", "medium", "big"]) };
    return { kind, emoji };
  });
}

function CompareSortGame() {
  const [language, setLanguage] = useState<Language>("Telugu");
  const [phase, setPhase] = useState<"start" | "play" | "end">("start");
  const [rounds, setRounds] = useState<CompareRound[]>(() => buildCompareRounds());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [locked, setLocked] = useState(false);
  const [shake, setShake] = useState(false);
  const [morePicked, setMorePicked] = useState<number | null>(null);
  const [sizeSelected, setSizeSelected] = useState<"small" | "big" | null>(null);
  const [sizePlaced, setSizePlaced] = useState<{ small: boolean; big: boolean }>({ small: false, big: false });
  const [sizeWrongBox, setSizeWrongBox] = useState<"small" | "big" | null>(null);
  const [sortPlaced, setSortPlaced] = useState<CompareSize[]>([]);
  const [sortWrong, setSortWrong] = useState<CompareSize | null>(null);

  const cl = compareLabels[language];
  const current = rounds[index];

  function resetRoundState() {
    setMorePicked(null); setSizeSelected(null); setSizePlaced({ small: false, big: false }); setSizeWrongBox(null);
    setSortPlaced([]); setSortWrong(null); setFeedback(null); setShake(false); setLocked(false);
  }
  function startGame() {
    setRounds(buildCompareRounds()); setIndex(0); setScore(0); setPhase("play"); resetRoundState();
  }
  function goNext() {
    const nextIndex = index + 1;
    if (nextIndex >= rounds.length) { setPhase("end"); return; }
    setIndex(nextIndex); resetRoundState();
  }
  function pickMore(sideIndex: number) {
    if (locked || current.kind !== "more") return;
    setLocked(true); setMorePicked(sideIndex);
    const correctIndex = current.a > current.b ? 0 : 1;
    if (sideIndex === correctIndex) { setScore((s) => s + 1); setFeedback({ ok: true, text: language === "Telugu" ? "సరైనది! 🎉" : "सही! 🎉" }); }
    else { setShake(true); setFeedback({ ok: false, text: language === "Telugu" ? "మళ్లీ ప్రయత్నించండి!" : "फिर कोशिश करें!" }); }
    window.setTimeout(goNext, 1200);
  }
  function selectSizeObject(key: "small" | "big") {
    if (current.kind !== "size" || sizePlaced[key]) return;
    setSizeSelected(key);
  }
  function dropOnBox(box: "small" | "big") {
    if (current.kind !== "size" || !sizeSelected) return;
    if (sizeSelected === box) {
      const nextPlaced = { ...sizePlaced, [box]: true };
      setSizePlaced(nextPlaced); setSizeSelected(null);
      if (nextPlaced.small && nextPlaced.big) {
        setScore((s) => s + 1);
        setFeedback({ ok: true, text: language === "Telugu" ? "సరైనది! 🎉" : "सही! 🎉" });
        window.setTimeout(goNext, 1000);
      }
    } else { setSizeWrongBox(box); window.setTimeout(() => setSizeWrongBox(null), 400); }
  }
  function tapSortTile(size: CompareSize) {
    if (current.kind !== "sort" || sortPlaced.includes(size)) return;
    const order: CompareSize[] = ["small", "medium", "big"];
    const expected = order[sortPlaced.length];
    if (size === expected) {
      const nextPlaced = [...sortPlaced, size];
      setSortPlaced(nextPlaced);
      if (nextPlaced.length === 3) {
        setScore((s) => s + 1);
        setFeedback({ ok: true, text: language === "Telugu" ? "సరైనది! 🎉" : "सही! 🎉" });
        window.setTimeout(goNext, 1000);
      }
    } else { setSortWrong(size); window.setTimeout(() => setSortWrong(null), 400); }
  }

  const stars = score >= 8 ? 3 : score >= 5 ? 2 : 1;

  return (
    <div className="compare-sort-game">
      <div className="compare-sort-head"><div><small>PRACTICE · COMPARE &amp; SORT</small><h3>{cl.title}</h3><p>{cl.subtitle}</p><BuddyTip name="vani" message={language === "Telugu" ? "ఏది ఎక్కువో చూద్దాం!" : "देखें कौन ज़्यादा है!"} /></div><b>⭐ {score}/{rounds.length}</b></div>
      <div className="compare-sort-lang" role="group" aria-label="Choose language"><button className={language === "Telugu" ? "active" : ""} onClick={() => setLanguage("Telugu")}>తెలుగు</button><button className={language === "Hindi" ? "active" : ""} onClick={() => setLanguage("Hindi")}>हिन्दी</button></div>
      {phase === "start" && <div className="compare-sort-start"><button className="compare-sort-primary" onClick={startGame}>{cl.start}</button></div>}
      {phase === "play" && current && <>
        <div className="compare-sort-progress">{language === "Telugu" ? "రౌండు" : "राउंड"} {index + 1}/{rounds.length} <span className={`compare-sort-badge ${current.kind}`}>{current.kind === "more" ? (language === "Telugu" ? "ఎక్కువ ఏది?" : "ज़्यादा कौन?") : current.kind === "size" ? (language === "Telugu" ? "పెద్దది-చిన్నది" : "बड़ा-छोटा") : (language === "Telugu" ? "సైజు క్రమం" : "आकार क्रम")}</span></div>
        <div className={`compare-sort-card${shake ? " shake" : ""}`}>
          {current.kind === "more" && <><p className="compare-sort-instruction">{cl.moreQuestion}</p><div className="compare-more-groups">{[current.a, current.b].map((count, i) => <button key={i} className={`compare-more-group${morePicked === i ? (i === (current.a > current.b ? 0 : 1) ? " correct" : " wrong") : ""}`} disabled={locked} onClick={() => pickMore(i)}><span>{current.emoji.repeat(count)}</span></button>)}</div></>}
          {current.kind === "size" && <><p className="compare-sort-instruction">{cl.sizeInstruction}</p><div className="compare-size-stage"><div className="compare-size-sources">{(["big", "small"] as const).map((key) => !sizePlaced[key] && <button key={key} className={`compare-size-source size-${key}${sizeSelected === key ? " selected" : ""}`} onClick={() => selectSizeObject(key)}><span>{current.emoji}</span></button>)}</div><div className="compare-size-boxes">{(["big", "small"] as const).map((key) => <button key={key} className={`compare-size-box${sizePlaced[key] ? " filled" : ""}${sizeWrongBox === key ? " wrong" : ""}`} onClick={() => dropOnBox(key)}>{sizePlaced[key] ? <span className={`size-${key}`}>{current.emoji}</span> : <small>{key === "big" ? cl.big : cl.small}</small>}</button>)}</div></div></>}
          {current.kind === "sort" && <><p className="compare-sort-instruction">{cl.sortInstruction}</p><div className="compare-sort-stage"><div className="compare-sort-bank">{current.order.filter((size) => !sortPlaced.includes(size)).map((size) => <button key={size} className={`compare-sort-tile size-${size}${sortWrong === size ? " wrong" : ""}`} onClick={() => tapSortTile(size)}><span>{current.emoji}</span></button>)}</div><div className="compare-sort-slots">{[0, 1, 2].map((slot) => <div key={slot} className="compare-sort-slot">{sortPlaced[slot] && <span className={`size-${sortPlaced[slot]}`}>{current.emoji}</span>}</div>)}</div></div></>}
        </div>
        <div className={`compare-sort-feedback${feedback ? (feedback.ok ? " ok" : " no") : ""}`} aria-live="polite">{feedback?.text}</div>
      </>}
      {phase === "end" && <div className="compare-sort-end"><span className="compare-sort-end-emoji">{score >= 8 ? "🏆" : score >= 5 ? "🎉" : "🌱"}</span><div className="compare-sort-stars">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div><b>{(language === "Telugu" ? "మీ స్కోరు: " : "आपका स्कोर: ") + score + "/" + rounds.length}</b><button className="compare-sort-primary" onClick={startGame}>{cl.playAgain}</button></div>}
    </div>
  );
}

export default function MathCorner() {
  const [introVisible, setIntroVisible] = useState(true);
  const [introFading, setIntroFading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroFading(true), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="math-corner" id="math-corner">
      <div className="math-heading">
        <div><small>NEW · PLAY AND LEARN</small><h2>Math Corner</h2><p>Follow Vageesh's Number Adventure — see &amp; hear a number, trace it, play, and rescue animals across the river — then keep practicing with fruit equations and comparing &amp; sorting.</p><BuddyTip name="vageesh" message="Let's learn numbers together — see, trace, play, and rescue!" /></div>
      </div>

      <div className="math-treasure-hunt">
        <iframe src="/number-adventure.html" title="Vageesh's Number Adventure" loading="lazy" style={{ width: "100%", height: "760px", border: 0, borderRadius: "24px", background: "#54cfff" }} />
        {introVisible && (
          <div
            className={`number-adventure-intro${introFading ? " fading" : ""}`}
            role="button"
            tabIndex={0}
            aria-label="Vageesh's Number Adventure — tap to play"
            onClick={() => setIntroFading(true)}
            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setIntroFading(true); }}
            onTransitionEnd={() => { if (introFading) setIntroVisible(false); }}
          >
            <img src="/assets/images/number-adventure-cover.webp" alt="Vageesh's Number Adventure" />
            <span className="number-adventure-intro-hint">Tap to play</span>
          </div>
        )}
      </div>

      <div className="treasure-hunt-game">
        <div className="treasure-hunt-head"><div><small>PLAY · NUMBER TREASURE HUNT</small><h3>Number Treasure Hunt</h3><p>Follow five number clues along the stepping stones to unlock Vageesh&apos;s treasure chest.</p><BuddyTip name="vageesh" message="Let's find the treasure together — follow the number clues!" /></div></div>
        <iframe src="/treasure-hunt.html" title="Vageesh's Number Treasure Hunt" loading="lazy" style={{ width: "100%", height: "620px", border: 0, borderRadius: "24px", background: "#153e2c" }} />
      </div>

      <FruitMathGame />
      <CompareSortGame />
    </section>
  );
}
