"use client";

import { useEffect, useRef, useState } from "react";

type VoiceButtonProps = {
  src?: string;
  playLabel: string;
  playingLabel?: string;
  missingLabel?: string;
  readyHint?: string;
  missingHint?: string;
  errorHint?: string;
  compact?: boolean;
};

export function VoiceButton({
  src,
  playLabel,
  playingLabel = "◼ Playing audio…",
  missingLabel = "＋ Recording needed",
  readyHint = "Original voice",
  missingHint = "Add WAV",
  errorHint = "Recording could not play. Please try again.",
  compact = false,
}: VoiceButtonProps) {
  const [state, setState] = useState<"idle" | "playing" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => { setState("idle"); }, [src]);

  async function play() {
    const player = audioRef.current;
    if (!player || !src) return;
    player.currentTime = 0;
    try {
      await player.play();
      setState("playing");
    } catch {
      setState("error");
    }
  }

  const audio = <audio ref={audioRef} src={src} onEnded={() => setState("idle")} onError={() => setState("error")} />;

  if (compact) {
    return (
      <>
        {audio}
        <button
          type="button"
          className={`voice-icon-button ${src ? "ready" : "missing"} ${state}`}
          onClick={play}
          disabled={!src}
          aria-label={playLabel}
          title={state === "error" ? errorHint : playLabel}
        >
          {state === "playing" ? "◼" : "🔊"}
        </button>
      </>
    );
  }

  return (
    <div className="voice-row">
      {audio}
      <button className={src ? "voice-button ready" : "voice-button missing"} onClick={play} disabled={!src}>
        {src ? (state === "playing" ? playingLabel : playLabel) : missingLabel}
      </button>
      <small>{src ? readyHint : missingHint}</small>
      {state === "error" && <small className="audio-error">{errorHint}</small>}
    </div>
  );
}
