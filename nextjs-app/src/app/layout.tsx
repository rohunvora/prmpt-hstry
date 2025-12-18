import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

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
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body style={{ fontFamily: 'var(--font-geist), system-ui, sans-serif' }}>
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
