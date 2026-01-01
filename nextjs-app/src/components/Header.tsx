/**
 * Header - cursorhabits
 *
 * NOIR TERMINAL AESTHETIC
 * Minimal header with phosphor accents
 */

'use client';

import { Github } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-noir-black/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="w-8 h-8 rounded-md bg-phosphor flex items-center justify-center">
            <span className="text-noir-black font-mono font-bold text-sm">ch</span>
          </div>
          <span className="font-display font-semibold text-text-primary text-lg group-hover:text-phosphor transition-colors">
            cursorhabits
          </span>
        </a>

        {/* GitHub Link */}
        <a
          href="https://github.com/rohunvora/prmpt-hstry/tree/main/cursor-habits"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-md border border-border-subtle bg-noir-charcoal hover:border-phosphor hover:text-phosphor transition-all duration-150 text-text-secondary"
        >
          <Github size={18} />
          <span className="font-mono text-sm hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
