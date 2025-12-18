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
    <article className="h-full bg-bg-card border border-border-subtle rounded-2xl p-8 transition-all duration-150 hover:border-border-medium hover:-translate-y-0.5 animate-fadeIn flex flex-col">
      {/* Category badge + model tag */}
      <div className="flex items-center gap-3 mb-5">
        <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-wide px-3 py-1.5 bg-accent-light text-accent-primary rounded-lg">
          {category}
        </span>
        <span className="text-xs text-text-muted">{modelTag}</span>
      </div>
      
      {/* Title */}
      <h2 className="text-lg font-semibold tracking-tight mb-3 text-text-primary">
        {title}
      </h2>
      
      {/* Description */}
      <p className="text-sm text-text-secondary mb-6 leading-relaxed">
        {description}
      </p>
      
      {/* Prompt code block - clickable to copy */}
      <div 
        onClick={copyToClipboard}
        className="relative mt-auto bg-bg-secondary border border-border-subtle rounded-xl p-5 pr-14 cursor-pointer transition-all duration-150 hover:border-accent-primary max-h-36 overflow-hidden"
        tabIndex={0}
        role="button"
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && copyToClipboard()}
      >
        <pre className="font-mono text-[0.8rem] leading-relaxed text-text-secondary whitespace-pre-wrap break-words m-0">
          {prompt}
        </pre>
        
        {/* Fade overlay for long prompts */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-bg-secondary to-transparent pointer-events-none" />
        
        {/* Copy button */}
        <button 
          onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
          className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-150 ${
            copied 
              ? 'bg-success-light border-success text-success'
              : 'bg-bg-card border-border-subtle text-text-muted hover:border-border-medium hover:text-text-primary'
          }`}
          aria-label="Copy prompt"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </article>
  )
}
