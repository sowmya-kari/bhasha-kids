"use client";

import { useState } from "react";
import "./opening-screen.css";

type Language = "Telugu" | "Hindi";

export default function OpeningScreen({ onEnter }: { onEnter: (language: Language) => void }) {
  const [language, setLanguage] = useState<Language>("Telugu");

  return (
    <section className="opening-screen agreed-welcome" aria-label="Welcome to Bhasha Kids">
      <div className="agreed-welcome-art">
        <img src="/assets/welcome/vageesh-vani-welcome-reference.webp" alt="Vageesh and Vani welcome children to Bhasha Kids" />

        <button
          className={`agreed-language agreed-telugu ${language === "Telugu" ? "selected" : ""}`}
          aria-label="Choose Telugu"
          aria-pressed={language === "Telugu"}
          onClick={() => setLanguage("Telugu")}
        >
          <span>అ</span>
        </button>
        <button
          className={`agreed-language agreed-hindi ${language === "Hindi" ? "selected" : ""}`}
          aria-label="Choose Hindi"
          aria-pressed={language === "Hindi"}
          onClick={() => setLanguage("Hindi")}
        >
          <span>अ</span>
        </button>
        <button className="agreed-begin" onClick={() => onEnter(language)} aria-label={`Let's Begin with ${language}`} />
      </div>
    </section>
  );
}
