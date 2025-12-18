'use client'

import Link from 'next/link'
import { Eye, Lock, MessageSquare, IterationCw, Clock, ChevronRight } from 'lucide-react'
import type { Showcase } from '@/lib/types'

interface ShowcaseCardProps {
  showcase: Showcase
  featured?: boolean
}

export function ShowcaseCard({ showcase, featured = false }: ShowcaseCardProps) {
  const priceFormatted = (showcase.price_cents / 100).toFixed(2)
  
  const categoryStyles: Record<string, { bg: string; text: string; label: string }> = {
    web: { bg: 'bg-[var(--accent-subtle)]', text: 'text-[var(--accent-primary)]', label: 'Web App' },
    design: { bg: 'bg-pink-500/10', text: 'text-pink-400', label: 'Design' },
    automation: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Automation' },
    content: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', label: 'Content' },
  }

  const style = categoryStyles[showcase.category] || categoryStyles.web

  return (
    <article 
      className={`group relative bg-[var(--bg-card)] border rounded-[var(--radius-2xl)] overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-lg)] animate-fadeIn ${
        featured 
          ? 'border-[var(--accent-primary)]/50 shadow-[0_0_40px_-12px_var(--accent-primary)]' 
          : 'border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider bg-gradient-to-r from-[var(--accent-primary)] to-amber-500 text-[var(--bg-primary)] rounded-[var(--radius-md)]">
          ★ Featured
        </div>
      )}

      {/* Preview Section with Browser Chrome */}
      <div className="relative border-b border-[var(--border-subtle)]">
        {/* Minimal Browser Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-secondary)]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-medium)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-medium)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-medium)]" />
          </div>
          <div className="flex-1 flex justify-center">
            <span className="px-3 py-1 text-[0.6875rem] font-mono text-[var(--text-dim)] bg-[var(--bg-primary)] rounded-[var(--radius-sm)]">
              {showcase.category}://showcase
            </span>
          </div>
        </div>
        
        {/* Content Preview */}
        <div className="h-[160px] p-4 bg-[var(--bg-primary)]">
          <div className="space-y-2">
            {showcase.preview_messages?.slice(0, 2).map((msg, i) => (
              <div 
                key={i}
                className={`p-3 rounded-[var(--radius-lg)] text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] ml-8' 
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] mr-8'
                }`}
              >
                <span className="font-mono text-[0.625rem] uppercase opacity-50 block mb-1">
                  {msg.role === 'user' ? 'You' : 'AI'}
                </span>
                <span className="line-clamp-2">{msg.content}</span>
              </div>
            ))}
          </div>
          
          {/* Locked overlay */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--bg-primary)] to-transparent flex items-end justify-center pb-4">
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Lock size={12} />
              {showcase.stats.prompts - 2}+ more messages
            </span>
          </div>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="p-5">
        {/* Category & Date */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-wide rounded-[var(--radius-sm)] ${style.bg} ${style.text}`}>
            {style.label}
          </span>
          <span className="text-[0.6875rem] text-[var(--text-dim)]">
            {new Date(showcase.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        {/* Title & Description */}
        <h3 className="text-base font-semibold tracking-tight mb-2 text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent-primary)] transition-colors">
          {showcase.title}
        </h3>
        
        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-2">
          {showcase.description}
        </p>
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 py-3 px-4 bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] mb-4">
          <StatItem icon={MessageSquare} value={showcase.stats.prompts} label="prompts" />
          <div className="w-px h-4 bg-[var(--border-subtle)]" />
          <StatItem icon={IterationCw} value={showcase.stats.iterations} label="iterations" />
          {showcase.stats.hours && (
            <>
              <div className="w-px h-4 bg-[var(--border-subtle)]" />
              <StatItem icon={Clock} value={showcase.stats.hours} label="hours" />
            </>
          )}
        </div>
        
        {/* Creator */}
        {showcase.creator && (
          <div className="flex items-center gap-3 mb-5">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-gradient-to-br from-[var(--accent-primary)] to-amber-500 text-[var(--bg-primary)]"
            >
              {showcase.creator.display_name?.[0] || showcase.creator.username?.[0] || 'A'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {showcase.creator.display_name || showcase.creator.username || 'Anonymous'}
              </span>
              <span className="text-[0.6875rem] text-[var(--text-dim)]">Creator</span>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link 
            href={`/showcase/${showcase.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)] transition-all"
          >
            <Eye size={16} />
            Preview
          </Link>
          <Link 
            href={`/showcase/${showcase.id}?unlock=true`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--accent-primary)] rounded-[var(--radius-lg)] text-sm font-semibold text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] transition-all group/btn"
          >
            ${priceFormatted}
            <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function StatItem({ icon: Icon, value, label }: { icon: typeof MessageSquare; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={14} className="text-[var(--text-dim)]" />
      <span className="text-sm font-semibold text-[var(--text-primary)]">{value}</span>
      <span className="text-xs text-[var(--text-dim)]">{label}</span>
    </div>
  )
}
