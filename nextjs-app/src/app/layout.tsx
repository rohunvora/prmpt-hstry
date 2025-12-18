/**
 * Root Layout - prompt.gallery
 * 
 * This is the main layout wrapper for the entire app.
 * 
 * FONTS:
 * - Instrument Sans: Primary font for UI text
 * - IBM Plex Mono: Monospace font for code/prompts
 * Both are loaded from Google Fonts.
 * 
 * VISUAL EFFECTS:
 * - .noise div creates a subtle grain texture overlay (defined in globals.css)
 * 
 * FOR REDESIGN:
 * - You can change fonts here or use next/font for better performance
 * - The noise effect can be removed or modified in globals.css
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "prompt.gallery — Monetize Your AI Prompt Histories",
  description: "The first marketplace for prompt journeys. See what's possible with AI, pay to learn exactly how.",
  keywords: ["prompts", "AI", "ChatGPT", "Claude", "Cursor", "prompt engineering", "marketplace"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts - Instrument Sans (UI) + IBM Plex Mono (code) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        {/* Noise texture overlay - creates subtle grain effect */}
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
