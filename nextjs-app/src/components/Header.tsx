'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: unknown, session: { user: User | null } | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const isActive = (path: string) => pathname === path
  const isShowcasePath = pathname.startsWith('/showcase')

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-[var(--border-subtle)]">
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 h-16">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 group"
        >
          <span className="text-xl text-[var(--accent-primary)] transition-transform group-hover:scale-110">⌘</span>
          <span className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
            prompt.gallery
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <NavLink href="/" active={isActive('/')}>
            Prompts
          </NavLink>
          
          <NavLink href="/showcases" active={isShowcasePath}>
            Showcases
          </NavLink>
          
          <NavLink href="/export" active={isActive('/export')} badge="New">
            Export
          </NavLink>

          {user && (
            <NavLink href="/dashboard" active={isActive('/dashboard')}>
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {!user && (
            <Link 
              href="/auth" 
              className="px-4 py-2 text-sm font-medium bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-[var(--radius-lg)] hover:bg-[var(--accent-secondary)] transition-all hover:-translate-y-px"
            >
              Sign In
            </Link>
          )}
          
          <a 
            href="https://github.com/rohunvora/prmpt-hstry" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] hover:bg-[var(--bg-card)] transition-all"
            aria-label="View on GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </nav>
    </header>
  )
}

interface NavLinkProps {
  href: string
  active: boolean
  children: React.ReactNode
  badge?: string
}

function NavLink({ href, active, children, badge }: NavLinkProps) {
  return (
    <Link 
      href={href}
      className={`relative px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-all ${
        active 
          ? 'text-[var(--text-primary)] bg-[var(--bg-card)]' 
          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]/50'
      }`}
    >
      <span className="flex items-center gap-2">
        {children}
        {badge && (
          <span className="px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded">
            {badge}
          </span>
        )}
      </span>
    </Link>
  )
}
