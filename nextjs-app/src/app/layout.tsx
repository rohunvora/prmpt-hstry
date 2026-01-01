/**
 * Root Layout - cursorhabits
 *
 * NOIR TERMINAL AESTHETIC
 * Bold display fonts meet precision monospace.
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cursorhabits — Your chat history writes your rules",
  description: "Turn your Cursor chat history into personalized rules. Stop repeating yourself. 100% local, privacy-first.",
  keywords: ["Cursor", "AI", "rules", "habits", "prompt engineering", "CLI", "developer tools"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Fontshare - Clash Display (bold display) + Satoshi (body) */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        {/* Google Fonts - JetBrains Mono (code) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-noir-black text-text-primary">
        {children}
      </body>
    </html>
  );
}
