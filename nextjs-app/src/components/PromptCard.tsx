/**
 * PromptCard Component
 * 
 * Displays a single prompt with copy-to-clipboard functionality.
 * Used on the homepage (/) to show curated prompts.
 * 
 * STYLING NOTE:
 * This component uses Tailwind's arbitrary value syntax (e.g., bg-[var(--bg-card)])
 * which has compatibility issues with Tailwind v4. The styles are backed up by
 * explicit CSS rules in globals.css.
 * 
 * FOR REDESIGN: Consider using the @theme colors instead:
 * - bg-bg-card instead of bg-[var(--bg-card)]
 * - text-text-primary instead of text-[var(--text-primary)]
 * See globals.css for available color tokens.
 */

'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface PromptCardProps {
  title: string
  description: string
  category: string      // e.g., "Coding", "Writing", "Analysis"
  modelTag: string      // e.g., "Claude / GPT-4", "Any model"
  prompt: string        // The actual prompt text to copy
}

export function PromptCard({ title, description, category, modelTag, prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <article 
      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 transition-all duration-250 hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-medium)] hover:-translate-y-0.5 animate-fadeIn"
    >
      {/* Category badge + model tag */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[0.7rem] font-medium uppercase tracking-wide px-2 py-1 bg-[var(--accent-glow)] text-[var(--accent-primary)] rounded-[var(--radius-sm)]">
          {category}
        </span>
        <span className="text-xs text-[var(--text-muted)]">{modelTag}</span>
      </div>
      
      {/* Title */}
      <h2 className="text-xl font-semibold tracking-tight mb-2 text-[var(--text-primary)]">
        {title}
      </h2>
      
      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
        {description}
      </p>
      
      {/* Prompt code block - clickable to copy */}
      <div 
        onClick={copyToClipboard}
        className="relative bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-4 pr-14 cursor-pointer transition-all duration-150 hover:border-[var(--accent-primary)] hover:shadow-[0_0_0_3px_var(--accent-glow)]"
        tabIndex={0}
        role="button"
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && copyToClipboard()}
      >
        <pre className="font-mono text-[0.8rem] leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap break-words m-0">
          {prompt}
        </pre>
        
        {/* Copy button */}
        <button 
          onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] border transition-all duration-150 ${
            copied 
              ? 'bg-[var(--success-glow)] border-[var(--success)] text-[var(--success)]'
              : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]'
          }`}
          aria-label="Copy prompt"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </article>
  )
}
