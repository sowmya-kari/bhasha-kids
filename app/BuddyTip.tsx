"use client";

import "./buddy-tip.css";

export type BuddyName = "vageesh" | "vani" | "mithu" | "mayuri" | "gaja";

type BuddyDef = { label: string; emoji?: string; photo?: string; color: string };

export const BUDDIES: Record<BuddyName, BuddyDef> = {
  vageesh: { label: "Vageesh", photo: "/assets/images/vageesh.png", color: "#168f91" },
  vani: { label: "Vani", photo: "/assets/images/vani.png", color: "#e64f7f" },
  mithu: { label: "Mithu", emoji: "🦜", color: "#1f9d6c" },
  mayuri: { label: "Mayuri", emoji: "🦚", color: "#3a6ea5" },
  gaja: { label: "Gaja", emoji: "🐘", color: "#7b8fa6" },
};

/** Small inline avatar + message, dropped near a section heading so a mascot feels present. */
export function BuddyTip({
  name,
  message,
  className,
}: {
  name: BuddyName;
  message: string;
  /** e.g. "on-dark" when placed on a dark-background section like Akshara Builder */
  className?: string;
}) {
  const buddy = BUDDIES[name];
  return (
    <div
      className={`buddy-tip${className ? ` ${className}` : ""}`}
      style={{ "--buddy-color": buddy.color } as React.CSSProperties}
    >
      <span className="buddy-tip-avatar">
        {buddy.photo ? (
          <img src={buddy.photo} alt={buddy.label} />
        ) : (
          <span className="buddy-tip-emoji">{buddy.emoji}</span>
        )}
      </span>
      <span className="buddy-tip-bubble">
        <b>{buddy.label}</b> {message}
      </span>
    </div>
  );
}

/** Larger celebration banner for win/achievement states. */
export function BuddyCelebrate({
  name,
  title,
  message,
  onAction,
  actionLabel,
}: {
  name: BuddyName;
  title: string;
  message: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  const buddy = BUDDIES[name];
  return (
    <div className="buddy-celebrate" style={{ "--buddy-color": buddy.color } as React.CSSProperties}>
      <span className="buddy-celebrate-avatar">
        {buddy.photo ? (
          <img src={buddy.photo} alt={buddy.label} />
        ) : (
          <span className="buddy-celebrate-emoji">{buddy.emoji}</span>
        )}
      </span>
      <div className="buddy-celebrate-copy">
        <b>{title}</b>
        <p>{message}</p>
      </div>
      {onAction && (
        <button onClick={onAction}>{actionLabel ?? "Play again"}</button>
      )}
    </div>
  );
}
