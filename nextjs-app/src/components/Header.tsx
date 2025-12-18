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

  return (
    <header className="bg-bg-card border-b border-border-subtle sticky top-0 z-50">
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span className="text-2xl text-accent-primary">⌘</span>
          <span className="text-xl font-semibold tracking-tight text-text-primary">
            prompt.gallery
          </span>
        </Link>
        
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Link 
            href="/" 
            className={`text-sm font-medium px-3 py-2 rounded-xl transition-colors no-underline ${
              isActive('/') 
                ? 'text-accent-primary bg-accent-light' 
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
            }`}
          >
            Prompts
          </Link>
          
          <Link 
            href="/showcases" 
            className={`text-sm font-medium px-3 py-2 rounded-xl transition-colors no-underline ${
              pathname.startsWith('/showcase') 
                ? 'text-accent-primary bg-accent-light' 
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
            }`}
          >
            Showcases
          </Link>
          
          <Link 
            href="/export" 
            className={`text-sm font-medium px-3 py-2 rounded-xl flex items-center gap-2 transition-colors no-underline ${
              isActive('/export') 
                ? 'text-accent-primary bg-accent-light' 
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
            }`}
          >
            Export
            <span className="font-mono text-[0.6rem] font-semibold tracking-wide px-1.5 py-0.5 rounded bg-accent-primary text-white">
              NEW
            </span>
          </Link>

          {user ? (
            <Link 
              href="/dashboard" 
              className={`text-sm font-medium px-3 py-2 rounded-xl transition-colors no-underline ${
                isActive('/dashboard') 
                  ? 'text-accent-primary bg-accent-light' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
              }`}
            >
              Dashboard
            </Link>
          ) : (
            <Link 
              href="/auth" 
              className="text-sm font-medium px-4 py-2 bg-accent-primary text-white rounded-xl hover:bg-accent-secondary transition-colors no-underline ml-2"
            >
              Sign In
            </Link>
          )}
          
          <a 
            href="https://github.com/rohunvora/prmpt-hstry" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors ml-2 p-2"
            aria-label="View on GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </nav>
    </header>
  )
}
