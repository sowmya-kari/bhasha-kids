import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MascotBuddies from "./mascot-buddies";
import MathCorner from "./math-corner";
import "./globals.css";
import "./alphabet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Basha Kids | Little words. Big worlds.",
  description: "A playful Telugu and Hindi learning experience for children ages 4-8.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <MathCorner />
        <MascotBuddies />
      </body>
    </html>
  );
}
