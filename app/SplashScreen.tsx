"use client";

import { useEffect, useRef } from "react";
import "./splash-screen.css";

const SPARK_COUNT = 16;
const sparks = Array.from({ length: SPARK_COUNT }, (_, i) => {
  const angle = (360 / SPARK_COUNT) * i;
  const dist = 70 + ((i * 37) % 50);
  const dx = Math.cos((angle * Math.PI) / 180) * dist;
  const dy = Math.sin((angle * Math.PI) / 180) * dist;
  const delay = 1.6 + ((i * 13) % 30) / 100;
  const size = 8 + ((i * 7) % 10);
  return { dx, dy, delay, size };
});

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const logoRef = useRef<HTMLImageElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    function finish() {
      if (doneRef.current) return;
      doneRef.current = true;
      onFinish();
    }
    const logo = logoRef.current;
    logo?.addEventListener("animationend", finish);
    const fallback = window.setTimeout(finish, 5200);
    return () => {
      logo?.removeEventListener("animationend", finish);
      window.clearTimeout(fallback);
    };
  }, [onFinish]);

  return (
    <div className="splash-stage" role="presentation" aria-label="Bhasha Kids intro" onClick={onFinish}>
      <img className="splash-frame splash-running splash-backdrop" src="/assets/splash/running.webp" alt="" aria-hidden="true" />
      <img className="splash-frame splash-highfive splash-backdrop" src="/assets/splash/highfive.webp" alt="" aria-hidden="true" />
      <img className="splash-frame splash-logo splash-backdrop" src="/assets/splash/logo.webp" alt="" aria-hidden="true" />
      <img className="splash-frame splash-running splash-sharp" src="/assets/splash/running.webp" alt="Vageesh and Vani running toward each other" />
      <img className="splash-frame splash-highfive splash-sharp" src="/assets/splash/highfive.webp" alt="Vageesh and Vani sharing a high five" />
      <img ref={logoRef} className="splash-frame splash-logo splash-sharp" src="/assets/splash/logo.webp" alt="Bhasha Kids" />
      <div className="splash-flash" />
      <div className="splash-sparkle-layer">
        {sparks.map((s, i) => (
          <span key={i} className="splash-spark" style={{ width: s.size, height: s.size, left: `calc(50% + ${s.dx}px)`, animationDelay: `${s.delay}s`, "--dist": `${s.dy}px` } as React.CSSProperties} />
        ))}
      </div>
      <div className="splash-center-burst" />
      <span className="splash-skip">Tap to skip</span>
    </div>
  );
}
