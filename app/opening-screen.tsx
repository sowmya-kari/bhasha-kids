"use client";

import { useEffect, useState } from "react";

type Language = "Telugu" | "Hindi";
type IntroItem = { letter: string; joiner: string; word: string; image: string; color: string; wash: string };

const lessons: Record<Language, IntroItem[]> = {
  Telugu: [
    { letter: "అ", joiner: "అంటే", word: "అమ్మ", image: "/assets/intro/mother.png", color: "#f46f61", wash: "#fff0e8" },
    { letter: "ఆ", joiner: "అంటే", word: "ఆకులు", image: "/assets/intro/leaves.png", color: "#14a98e", wash: "#e8faf3" },
    { letter: "ఇ", joiner: "అంటే", word: "ఇల్లు", image: "/assets/intro/house.png", color: "#6c5bd9", wash: "#f0edff" },
    { letter: "ఈ", joiner: "అంటే", word: "ఈగ", image: "/assets/intro/fly.png", color: "#8b62d7", wash: "#f5edff" },
  ],
  Hindi: [
    { letter: "अ", joiner: "से", word: "अनार", image: "/assets/intro/pomegranate.png", color: "#ee594f", wash: "#fff0ec" },
    { letter: "आ", joiner: "से", word: "आम", image: "/assets/intro/mango.png", color: "#e2a21d", wash: "#fff8dc" },
    { letter: "इ", joiner: "से", word: "इमली", image: "/assets/intro/tamarind.png", color: "#9a633f", wash: "#fff3e9" },
    { letter: "ई", joiner: "से", word: "ईख", image: "/assets/intro/sugarcane.png", color: "#20a572", wash: "#eaf9ef" },
  ],
};

export default function OpeningScreen({ onEnter }: { onEnter: (language: Language) => void }) {
  const [language, setLanguage] = useState<Language | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!language) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % lessons[language].length);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [language, index]);

  const choose = (next: Language) => {
    setLanguage(next);
    setIndex(0);
  };
  const item = language ? lessons[language][index] : null;

  return (
    <section className="opening-screen" aria-label="Basha Kids alphabet introduction">
      {!language ? (
        <div className="opening-choice">
          <div className="opening-choice-art" aria-hidden="true">
            <span className="choice-letter telugu-letter">అ</span>
            <span className="choice-letter hindi-letter">अ</span>
            <i>✦</i>
          </div>
          <div className="opening-choice-copy">
            <p className="opening-kicker">A little language adventure</p>
            <h1>Let&apos;s meet<br/><em>our letters!</em></h1>
            <p>Choose a language. Each letter will introduce a friendly picture and word.</p>
            <div className="opening-language-buttons">
              <button onClick={() => choose("Telugu")}><b>అ</b><span>తెలుగు<small>Telugu</small></span><i>→</i></button>
              <button onClick={() => choose("Hindi")}><b>अ</b><span>हिन्दी<small>Hindi</small></span><i>→</i></button>
            </div>
            <button className="opening-skip" onClick={() => onEnter("Telugu")}>Skip introduction</button>
          </div>
        </div>
      ) : item ? (
        <div className="opening-show" style={{ "--accent": item.color, "--wash": item.wash } as React.CSSProperties}>
          <header>
            <button onClick={() => setLanguage(null)}>← Change language</button>
            <span>{language === "Telugu" ? "తెలుగు" : "हिन्दी"} · {index + 1} of {lessons[language].length}</span>
            <button onClick={() => onEnter(language)}>Skip intro →</button>
          </header>

          <div className="opening-stage" key={`${language}-${index}`}>
            <div className="opening-letter-side">
              <span className="opening-sparkle sparkle-one">✦</span>
              <span className="opening-sparkle sparkle-two">✦</span>
              <div className="opening-big-letter">
                {item.letter}
                <span className="letter-face" aria-hidden="true"><i/><i/><b/></span>
              </div>
            </div>

            <div className="opening-object-side">
              <div className="opening-object-blob"/>
              <img src={item.image} alt={item.word}/>
            </div>

            <div className="opening-phrase">
              <strong>{item.letter}</strong>
              <span>{item.joiner}</span>
              <b>{item.word}</b>
            </div>
          </div>

          <footer>
            <div className="opening-dots">
              {lessons[language].map((_, i) => <button key={i} className={i === index ? "active" : ""} onClick={() => setIndex(i)} aria-label={`Show letter ${i + 1}`}/>)}
            </div>
            <button className="opening-next" onClick={() => index === lessons[language].length - 1 ? onEnter(language) : setIndex(index + 1)}>
              {index === lessons[language].length - 1 ? "Start exploring" : "Next"} <b>→</b>
            </button>
          </footer>
        </div>
      ) : null}
    </section>
  );
}
