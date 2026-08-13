"use client";

import Image from "next/image";
import "./hero-mascots.css";

/**
 * Drop this inside the .hero section in page.tsx (anywhere in the JSX,
 * position is handled by CSS). Vageesh anchors the bottom-left corner,
 * Vani anchors the bottom-right corner, matching the reference poster's
 * flanking-hero-character layout.
 */
export default function HeroMascots() {
  return (
    <>
      <div className="hero-mascot hero-mascot-left">
        <div className="hero-mascot-bubble">Hi, I&apos;m Vageesh! 👋</div>
        <Image src="/assets/images/vageesh.png" alt="Vageesh" width={250} height={466} priority />
      </div>
      <div className="hero-mascot hero-mascot-right">
        <div className="hero-mascot-bubble">Hi, I&apos;m Vani! 📖</div>
        <Image src="/assets/images/vani.png" alt="Vani" width={300} height={478} priority />
      </div>
    </>
  );
}
