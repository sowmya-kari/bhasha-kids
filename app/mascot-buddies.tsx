"use client";

import { useEffect, useState } from "react";
import "./mascot-buddies.css";

function Vageesh() {
  return (
    <svg viewBox="0 0 220 300" role="img" aria-label="Vageesh giving a thumbs up">
      <defs>
        <linearGradient id="vgHoodie" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#53d6c1"/><stop offset="1" stopColor="#168f91"/></linearGradient>
        <linearGradient id="vgSkin" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffd09a"/><stop offset="1" stopColor="#e9985f"/></linearGradient>
      </defs>
      <ellipse cx="112" cy="282" rx="68" ry="12" fill="#163154" opacity=".12"/>
      <path d="M68 254h35v30H58c-8-1-8-12 1-16z" fill="#f9fafb" stroke="#23565b" strokeWidth="4"/>
      <path d="M125 254h34l10 14c8 7 3 16-6 16h-45z" fill="#f9fafb" stroke="#23565b" strokeWidth="4"/>
      <path d="M71 181h82l9 80h-42l-7-50-6 50H65z" fill="#234b72"/>
      <path d="M68 160c8-23 24-35 45-35s40 12 47 37l-5 63H68z" fill="url(#vgHoodie)"/>
      <path d="M87 140l26 29 27-29" fill="none" stroke="#e8fffb" strokeWidth="8" strokeLinecap="round"/>
      <path d="M110 166v45" stroke="#e8fffb" strokeWidth="4"/>
      <path d="M92 154v25M134 154v25" stroke="#fff" strokeWidth="3"/>
      <circle cx="147" cy="174" r="9" fill="#ffd84d"/><path d="m147 166 2.5 5.5 6 .7-4.5 4 1.2 6-5.2-3-5.2 3 1.2-6-4.5-4 6-.7z" fill="#fff4aa"/>
      <path d="M70 167c-18 10-27 31-20 47 6 13 20 8 23-1l13-43z" fill="url(#vgSkin)"/>
      <path className="vg-thumb" d="M52 201c-10-3-22-14-20-26 1-7 9-7 12-1l4 8 2-30c1-9 13-8 14 1l2 26 10-9c7-6 15 3 9 10l-17 24c-4 5-10 5-16-3z" fill="url(#vgSkin)" stroke="#d77f50" strokeWidth="3"/>
      <path d="M154 170c19 14 22 44 5 51-11 4-19-7-15-17z" fill="url(#vgSkin)"/>
      <circle cx="111" cy="91" r="58" fill="url(#vgSkin)"/>
      <path d="M58 79C58 39 83 18 116 22c28-14 55 11 49 46-16-18-32-20-49-17-21 4-37 16-58 28z" fill="#211b24"/>
      <path d="M60 59c12-33 45-52 76-35-29 0-46 10-56 29z" fill="#32262b"/>
      <circle cx="87" cy="93" r="25" fill="#fff" stroke="#151824" strokeWidth="8"/><circle cx="137" cy="93" r="25" fill="#fff" stroke="#151824" strokeWidth="8"/>
      <path d="M111 92h4" stroke="#151824" strokeWidth="8"/>
      <circle cx="91" cy="96" r="10" fill="#56331f"/><circle cx="141" cy="96" r="10" fill="#56331f"/><circle cx="94" cy="92" r="3" fill="#fff"/><circle cx="144" cy="92" r="3" fill="#fff"/>
      <path d="M95 119c11 12 27 12 38 0" fill="#fff" stroke="#772f35" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

function Vani() {
  return (
    <svg viewBox="0 0 220 300" role="img" aria-label="Vani waving with a storybook">
      <defs>
        <linearGradient id="vnDress" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffd94f"/><stop offset="1" stopColor="#ef9d2f"/></linearGradient>
        <linearGradient id="vnSkin" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffd5a7"/><stop offset="1" stopColor="#e89b68"/></linearGradient>
      </defs>
      <ellipse cx="110" cy="282" rx="68" ry="12" fill="#7b2444" opacity=".12"/>
      <path d="M77 247h34v32H67c-10 0-11-12-2-17zM126 247h34l12 17c5 8 0 15-9 15h-43z" fill="#ec4d79" stroke="#a32356" strokeWidth="4"/>
      <path d="M82 188h68l9 65h-37l-10-42-8 42H73z" fill="#773d8d"/>
      <path d="M66 158c9-25 27-37 49-37 25 0 43 14 50 41l-10 67H67z" fill="url(#vnDress)" stroke="#f37768" strokeWidth="3"/>
      <path d="M82 149c13 8 50 8 66 0" fill="none" stroke="#fff0b0" strokeWidth="5"/><path d="M87 164h57M88 181h56" stroke="#f36c78" strokeWidth="3" strokeDasharray="5 5"/>
      <path className="vn-wave" d="M155 166c19-12 28-34 20-49-4-8 5-13 10-6l6 10 1-22c1-8 12-8 13 0l2 33c1 12-8 24-25 36z" fill="url(#vnSkin)" stroke="#d98358" strokeWidth="3"/>
      <path d="M72 166c-14 9-18 35-5 47 8 7 19 1 18-10z" fill="url(#vnSkin)"/>
      <path d="M80 177h43v57H80c-9-14-9-43 0-57z" fill="#733b7c" stroke="#4e245d" strokeWidth="4"/><path d="M123 177h34v57h-34z" fill="#9d4a98" stroke="#4e245d" strokeWidth="4"/><path d="M85 187h31M85 196h25M130 187h20M130 196h17" stroke="#ffd5df" strokeWidth="3"/>
      <path d="M60 91c-4-51 26-75 56-67 32-14 67 15 54 66l-7 51H60z" fill="#43251e"/>
      <path d="M55 103c-12 18-7 50 10 57 5-20 9-40 8-58zM165 99c15 18 10 51-5 62-5-20-8-40-7-60z" fill="#5b3024"/>
      <circle cx="111" cy="91" r="55" fill="url(#vnSkin)"/>
      <path d="M57 83c8-43 35-65 66-58 25-10 49 16 43 49-19-19-38-21-55-16-17 5-31 14-54 25z" fill="#5b3024"/>
      <path d="M66 49c-14-14 2-25 14-15 8-17 27-6 20 8-9 9-20 13-34 7z" fill="#ed4f87"/>
      <circle cx="87" cy="94" r="24" fill="#fff" stroke="#ef4e87" strokeWidth="7"/><circle cx="136" cy="94" r="24" fill="#fff" stroke="#ef4e87" strokeWidth="7"/><path d="M111 93h3" stroke="#ef4e87" strokeWidth="7"/>
      <circle cx="91" cy="97" r="10" fill="#583422"/><circle cx="140" cy="97" r="10" fill="#583422"/><circle cx="94" cy="93" r="3" fill="#fff"/><circle cx="143" cy="93" r="3" fill="#fff"/>
      <path d="M95 120c10 11 26 11 37 0" fill="#fff" stroke="#842f47" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

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
      <div className="mascot-character vageesh"><Vageesh/><b>Vageesh</b></div>
      <div className="mascot-message">
        <small>Your learning buddies!</small>
        <strong>Great job! 🎉</strong>
        <span>చాలా బాగా చేశావు! · बहुत बढ़िया!</span>
        <button onClick={() => setOpen((value) => !value)}>{open ? "See us later" : "Say hello"}</button>
      </div>
      <div className="mascot-character vani"><Vani/><b>Vani</b></div>
    </aside>
  );
}
