/**
 * Header - cursorhabits
 * 
 * Minimal header: logo/brand + GitHub link
 */

'use client';

import { Github } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
            <span className="text-white font-mono font-bold text-sm">ch</span>
          </div>
          <span className="font-display font-semibold text-text-primary text-lg">
            cursorhabits
          </span>
        </a>

        {/* GitHub Link */}
        <a 
          href="https://github.com/rohunvora/prmpt-hstry/tree/main/cursor-habits"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg border border-border-subtle bg-bg-card hover:border-accent-primary hover:text-accent-primary transition-all duration-150 text-text-secondary"
        >
          <Github size={18} />
          <span className="font-medium text-sm hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
