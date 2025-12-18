import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <span className="text-lg text-[var(--accent-primary)] transition-transform group-hover:scale-110">⌘</span>
              <span className="text-base font-semibold text-[var(--text-primary)]">prompt.gallery</span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              The first marketplace for prompt journeys. Learn from real AI conversations.
            </p>
          </div>
          
          {/* Browse */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">Browse</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/">All Prompts</FooterLink>
              <FooterLink href="/showcases">Showcases</FooterLink>
              <FooterLink href="/showcases?category=web">Web Apps</FooterLink>
              <FooterLink href="/showcases?category=automation">Automation</FooterLink>
            </ul>
          </div>
          
          {/* Creators */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">For Creators</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/export">Upload Showcase</FooterLink>
              <FooterLink href="/dashboard">Creator Dashboard</FooterLink>
              <FooterLink href="/about#pricing">Pricing & Payouts</FooterLink>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="https://github.com/rohunvora/prmpt-hstry" external>GitHub</FooterLink>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-dim)]">
            © {currentYear} prompt.gallery
          </p>
          <p className="text-sm text-[var(--text-dim)]">
            Built with{' '}
            <a 
              href="https://cursor.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            >
              Cursor
            </a>
            {' '}+{' '}
            <a 
              href="https://anthropic.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            >
              Claude
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

interface FooterLinkProps {
  href: string
  children: React.ReactNode
  external?: boolean
}

function FooterLink({ href, children, external }: FooterLinkProps) {
  if (external) {
    return (
      <li>
        <a 
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          {children}
        </a>
      </li>
    )
  }

  return (
    <li>
      <Link 
        href={href}
        className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        {children}
      </Link>
    </li>
  )
}
