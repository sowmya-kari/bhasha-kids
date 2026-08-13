"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import "./mascot-buddies.css";

export default function MascotBuddies() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <aside className={`mascot-buddies ${open ? "is-open" : ""}`} aria-label="Meet Vageesh and Vani">
      <button className="mascot-close" onClick={() => setHidden(true)} aria-label="Hide learning buddies">×</button>
      <div className="mascot-sparkles" aria-hidden="true">✦ ⭐ ✨</div>
      <div className="mascot-character vageesh">
        <Image src="/assets/images/vageesh.png" alt="Vageesh giving a thumbs up" width={250} height={466} />
        <b>Vageesh</b>
      </div>
      <div className="mascot-message">
        <small>Your learning buddies!</small>
        <strong>Great job! 🎉</strong>
        <span>చాలా బాగా చేశావు! · बहुत बढ़िया!</span>
        <button onClick={() => setOpen((value) => !value)}>{open ? "See us later" : "Say hello"}</button>
      </div>
      <div className="mascot-character vani">
        <Image src="/assets/images/vani.png" alt="Vani waving with a storybook" width={300} height={478} />
        <b>Vani</b>
      </div>
    </aside>
  );
}
