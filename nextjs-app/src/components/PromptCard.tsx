'use client'

import { useState } from 'react'
import { Copy, Check, Sparkles } from 'lucide-react'

interface PromptCardProps {
  title: string
  description: string
  category: string
  modelTag: string
  prompt: string
}

export function PromptCard({ title, description, category, modelTag, prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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
      className="group relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-5 transition-all duration-200 hover:border-[var(--border-medium)] hover:shadow-[var(--shadow-lg)] animate-fadeIn"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with category and model */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide bg-[var(--accent-subtle)] text-[var(--accent-primary)] rounded-[var(--radius-md)]">
          <Sparkles size={12} />
          {category}
        </span>
        <span className="text-xs text-[var(--text-dim)] font-mono">
          {modelTag}
        </span>
      </div>
      
      {/* Title and description */}
      <h2 className="text-base font-semibold tracking-tight mb-2 text-[var(--text-primary)] line-clamp-1">
        {title}
      </h2>
      
      <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed line-clamp-2">
        {description}
      </p>
      
      {/* Prompt box */}
      <div 
        onClick={copyToClipboard}
        className={`relative bg-[var(--bg-secondary)] border rounded-[var(--radius-lg)] p-4 cursor-pointer transition-all duration-150 ${
          copied 
            ? 'border-[var(--success)] bg-[var(--success-subtle)]' 
            : isHovered 
              ? 'border-[var(--border-medium)]' 
              : 'border-[var(--border-subtle)]'
        }`}
        tabIndex={0}
        role="button"
        aria-label="Copy prompt to clipboard"
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && copyToClipboard()}
      >
        <pre className="font-mono text-[0.8125rem] leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap break-words pr-10 line-clamp-4">
          {prompt}
        </pre>
        
        {/* Copy button */}
        <button 
          onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] transition-all duration-150 ${
            copied 
              ? 'bg-[var(--success)] text-white'
              : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)]'
          }`}
          aria-label="Copy prompt"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>

      {/* Subtle bottom indicator */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-subtle)]">
        <span className="text-xs text-[var(--text-dim)]">Click to copy</span>
        <span className={`text-xs font-medium transition-colors ${copied ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
          {copied ? '✓ Copied!' : ''}
        </span>
      </div>
    </article>
  )
}
