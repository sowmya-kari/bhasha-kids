"use client";

import { useEffect, useState } from "react";
import LegacyHome from "./LegacyHome";
import TeluguPosterLetters from "./TeluguPosterLetters";

type LetterGroup = "Vowels" | "Consonants";

export default function Home() {
  const [teluguGroup, setTeluguGroup] = useState<LetterGroup | null>(null);

  useEffect(() => {
    const intercept = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest(".learn-paths button") as HTMLButtonElement | null;
      if (!button) return;
      const activeLanguage = document.querySelector(".learn-language button.active small")?.textContent?.trim();
      if (activeLanguage !== "Telugu") return;
      const text = button.textContent || "";
      const group: LetterGroup = text.includes("Consonants") ? "Consonants" : "Vowels";
      event.preventDefault();
      event.stopPropagation();
      setTeluguGroup(group);
    };
    document.addEventListener("click", intercept, true);
    return () => document.removeEventListener("click", intercept, true);
  }, []);

  return <>
    <LegacyHome />
    {teluguGroup && <TeluguPosterLetters initialGroup={teluguGroup} onClose={() => setTeluguGroup(null)} />}
  </>;
}
