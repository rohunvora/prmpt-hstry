/**
 * Footer - cursorhabits
 *
 * NOIR TERMINAL AESTHETIC
 * Minimal footer with phosphor accents
 */

export default function Footer() {
  return (
    <footer className="bg-noir-dark border-t border-border-subtle">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-phosphor flex items-center justify-center">
              <span className="text-noir-black font-mono font-bold text-xs">ch</span>
            </div>
            <span className="font-display font-medium text-text-secondary">
              cursorhabits
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm font-mono text-text-muted">
            <a
              href="https://github.com/rohunvora/prmpt-hstry/tree/main/cursor-habits"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-phosphor transition-colors"
            >
              GitHub
            </a>
            <a
              href="/privacy"
              className="hover:text-phosphor transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="hover:text-phosphor transition-colors"
            >
              Terms
            </a>
          </div>

          {/* Credit */}
          <p className="text-sm text-text-muted font-mono">
            Made by{' '}
            <a
              href="https://twitter.com/rohunvora"
              target="_blank"
              rel="noopener noreferrer"
              className="text-phosphor hover:underline"
            >
              @rohunvora
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
