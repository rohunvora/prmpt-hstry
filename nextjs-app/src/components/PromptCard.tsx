'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface PromptCardProps {
  title: string
  description: string
  category: string
  modelTag: string
  prompt: string
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
    <article className="h-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[16px] p-7 transition-all duration-150 hover:border-[var(--border-medium)] hover:-translate-y-0.5 animate-fadeIn flex flex-col">
      {/* Category badge + model tag */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-wide px-2.5 py-1 bg-[var(--accent-light)] text-[var(--accent-primary)] rounded-[var(--radius-sm)]">
          {category}
        </span>
        <span className="text-xs text-[var(--text-muted)]">{modelTag}</span>
      </div>
      
      {/* Title */}
      <h2 className="text-lg font-semibold tracking-tight mb-2.5 text-[var(--text-primary)]">
        {title}
      </h2>
      
      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
        {description}
      </p>
      
      {/* Prompt code block - clickable to copy */}
      <div 
        onClick={copyToClipboard}
        className="relative mt-auto bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-4 pr-14 cursor-pointer transition-all duration-150 hover:border-[var(--accent-primary)] max-h-40 overflow-hidden"
        tabIndex={0}
        role="button"
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && copyToClipboard()}
      >
        <pre className="font-mono text-[0.8rem] leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap break-words m-0">
          {prompt}
        </pre>
        
        {/* Fade overlay for long prompts */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent pointer-events-none" />
        
        {/* Copy button */}
        <button 
          onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] border transition-all duration-150 ${
            copied 
              ? 'bg-[var(--success-light)] border-[var(--success)] text-[var(--success)]'
              : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]'
          }`}
          aria-label="Copy prompt"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </article>
  )
}
