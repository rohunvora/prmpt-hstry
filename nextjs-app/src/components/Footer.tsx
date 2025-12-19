/**
 * Footer - cursorhabits
 * 
 * Minimal footer with essential links
 */

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border-subtle">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent-primary flex items-center justify-center">
              <span className="text-white font-mono font-bold text-xs">ch</span>
            </div>
            <span className="font-display font-medium text-text-secondary">
              cursorhabits
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <a 
              href="https://github.com/rohunvora/prmpt-hstry/tree/main/cursor-habits"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-primary transition-colors"
            >
              GitHub
            </a>
            <a 
              href="/privacy"
              className="hover:text-accent-primary transition-colors"
            >
              Privacy
            </a>
            <a 
              href="/terms"
              className="hover:text-accent-primary transition-colors"
            >
              Terms
            </a>
          </div>

          {/* Credit */}
          <p className="text-sm text-text-muted">
            Made with ☕ by{' '}
            <a 
              href="https://twitter.com/rohunvora"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-primary transition-colors"
            >
              @rohunvora
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
