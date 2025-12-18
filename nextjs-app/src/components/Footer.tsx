import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-bg-card border-t border-border-subtle mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 no-underline mb-3">
              <span className="text-xl text-accent-primary">⌘</span>
              <span className="text-lg font-semibold text-text-primary">prompt.gallery</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              The first marketplace for prompt journeys.
            </p>
          </div>
          
          {/* Browse */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Browse</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-text-secondary hover:text-accent-primary transition-colors">
                  All Prompts
                </Link>
              </li>
              <li>
                <Link href="/showcases" className="text-text-secondary hover:text-accent-primary transition-colors">
                  Showcases
                </Link>
              </li>
              <li>
                <Link href="/showcases?category=web" className="text-text-secondary hover:text-accent-primary transition-colors">
                  Web Apps
                </Link>
              </li>
              <li>
                <Link href="/showcases?category=automation" className="text-text-secondary hover:text-accent-primary transition-colors">
                  Automation
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Creators */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">For Creators</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/export" className="text-text-secondary hover:text-accent-primary transition-colors">
                  Upload Showcase
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-text-secondary hover:text-accent-primary transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about#pricing" className="text-text-secondary hover:text-accent-primary transition-colors">
                  Pricing & Payouts
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-text-secondary hover:text-accent-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary hover:text-accent-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-accent-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/rohunvora/prmpt-hstry" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border-subtle text-center text-sm text-text-muted">
          <p>
            © {new Date().getFullYear()} prompt.gallery. Built with{' '}
            <a 
              href="https://cursor.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent-primary hover:text-accent-secondary"
            >
              Cursor
            </a>
            {' '}+{' '}
            <a 
              href="https://anthropic.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent-primary hover:text-accent-secondary"
            >
              Claude
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
