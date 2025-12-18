/**
 * ShowcaseCard Component
 * 
 * Displays a paid showcase item with preview, stats, creator info, and purchase CTAs.
 * Used on the /showcases page and homepage.
 * 
 * DATA SOURCE: Showcase data comes from Supabase (see lib/types.ts for schema)
 * PAYMENTS: Stripe integration in /api/checkout handles purchases
 * 
 * STYLING: Same Tailwind v4 caveats as PromptCard - see globals.css for notes.
 */

'use client'

import Link from 'next/link'
import { Eye, Lock, MessageSquare, CheckCircle, Clock } from 'lucide-react'
import type { Showcase } from '@/lib/types'

interface ShowcaseCardProps {
  showcase: Showcase
  featured?: boolean
}

export function ShowcaseCard({ showcase, featured = false }: ShowcaseCardProps) {
  const priceFormatted = (showcase.price_cents / 100).toFixed(2)
  
  const categoryColors: Record<string, string> = {
    web: 'bg-[var(--accent-glow)] text-[var(--accent-primary)]',
    design: 'bg-[rgba(236,72,153,0.15)] text-[#ec4899]',
    automation: 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]',
    content: 'bg-[rgba(99,102,241,0.15)] text-[#818cf8]',
  }

  return (
    <article 
      className={`bg-[var(--bg-card)] border rounded-[var(--radius-lg)] overflow-hidden transition-all duration-250 hover:border-[var(--border-medium)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-fadeIn ${
        featured 
          ? 'border-[var(--accent-primary)] shadow-[0_0_0_1px_var(--accent-glow)]' 
          : 'border-[var(--border-subtle)]'
      }`}
    >
      {/* Preview Section */}
      <div className="relative bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
        {/* Browser Chrome */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="font-mono text-xs text-[var(--text-muted)] bg-[var(--bg-primary)] px-3 py-1 rounded">
              {showcase.category} • showcase
            </span>
          </div>
        </div>
        
        {/* Content Preview */}
        <div className="h-[180px] p-4 flex flex-col gap-2">
          {showcase.preview_messages?.slice(0, 2).map((msg, i) => (
            <div 
              key={i}
              className={`p-2 rounded text-xs truncate ${
                msg.role === 'user' 
                  ? 'bg-[var(--accent-glow)] text-[var(--accent-primary)]' 
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
              }`}
            >
              <span className="font-mono text-[0.65rem] uppercase opacity-60 mr-2">
                {msg.role === 'user' ? 'You' : 'AI'}:
              </span>
              {msg.content.substring(0, 80)}...
            </div>
          ))}
          <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
            <Lock size={16} className="mr-2" />
            <span className="text-sm">{showcase.stats.prompts - 2}+ more messages</span>
          </div>
        </div>
        
        {featured && (
          <span className="absolute top-3 right-3 text-[0.7rem] font-semibold px-2 py-1 rounded-[var(--radius-sm)] text-black" style={{ background: 'linear-gradient(135deg, var(--accent-primary), #f59e0b)' }}>
            ⭐ Featured
          </span>
        )}
      </div>
      
      {/* Info Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`font-mono text-[0.65rem] font-medium uppercase tracking-wide px-2 py-1 rounded-[var(--radius-sm)] ${categoryColors[showcase.category] || categoryColors.web}`}>
            {showcase.category}
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            {new Date(showcase.created_at).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold tracking-tight mb-2 text-[var(--text-primary)]">
          {showcase.title}
        </h3>
        
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">
          {showcase.description}
        </p>
        
        {/* Stats */}
        <div className="flex gap-4 p-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] mb-4">
          <div className="flex items-center gap-1.5">
            <MessageSquare size={14} className="text-[var(--text-muted)]" />
            <span className="font-semibold text-sm">{showcase.stats.prompts}</span>
            <span className="text-xs text-[var(--text-muted)]">prompts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-[var(--text-muted)]" />
            <span className="font-semibold text-sm">{showcase.stats.iterations}</span>
            <span className="text-xs text-[var(--text-muted)]">iterations</span>
          </div>
          {showcase.stats.hours && (
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[var(--text-muted)]" />
              <span className="font-semibold text-sm">{showcase.stats.hours}</span>
              <span className="text-xs text-[var(--text-muted)]">hours</span>
            </div>
          )}
        </div>
        
        {/* Creator */}
        {showcase.creator && (
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, var(--accent-primary), #f59e0b)' }}
            >
              {showcase.creator.display_name?.[0] || showcase.creator.username?.[0] || 'A'}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{showcase.creator.display_name || showcase.creator.username || 'Anonymous'}</span>
              <span className="text-xs text-[var(--text-muted)]">Creator</span>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3">
          <Link 
            href={`/showcase/${showcase.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)] transition-all no-underline"
          >
            <Eye size={16} />
            Preview
          </Link>
          <Link 
            href={`/showcase/${showcase.id}?unlock=true`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[var(--accent-primary)] rounded-[var(--radius-md)] text-sm font-semibold text-black hover:bg-[var(--accent-secondary)] hover:-translate-y-0.5 transition-all no-underline"
          >
            <Lock size={16} />
            Unlock ${priceFormatted}
          </Link>
        </div>
      </div>
    </article>
  )
}

