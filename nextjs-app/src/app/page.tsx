'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PromptCard } from '@/components/PromptCard'
import { prompts } from '@/lib/prompts-data'

type Category = 'all' | 'coding' | 'writing' | 'analysis' | 'creative' | 'system'

export default function PromptsPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('all')
  const [copiedToast, setCopiedToast] = useState(false)

  const filteredPrompts = activeFilter === 'all' 
    ? prompts 
    : prompts.filter(p => p.category === activeFilter)

  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'coding', label: 'Coding' },
    { value: 'writing', label: 'Writing' },
    { value: 'analysis', label: 'Analysis' },
    { value: 'creative', label: 'Creative' },
    { value: 'system', label: 'System' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-12 pb-8 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-4 text-balance">
              Curated prompts that{' '}
              <span className="text-[var(--accent-primary)]">actually work</span>
            </h1>
            <p className="text-base text-[var(--text-muted)] leading-relaxed">
              Copy-ready prompts for developers, writers, and creators. Click any card to copy.
            </p>
          </div>
        </section>

        {/* Filters */}
        <div className="sticky top-16 z-40 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-[var(--border-subtle)]">
          <nav className="flex justify-center gap-2 px-6 py-4 max-w-6xl mx-auto">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveFilter(cat.value)}
                className={`px-4 py-2 text-sm font-medium rounded-[var(--radius-full)] border transition-all duration-150 ${
                  activeFilter === cat.value
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Gallery Grid */}
        <section className="px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {filteredPrompts.map((prompt, index) => (
              <div 
                key={prompt.id}
                data-animate={Math.min(index + 1, 8)}
              >
                <PromptCard
                  title={prompt.title}
                  description={prompt.description}
                  category={prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)}
                  modelTag={prompt.modelTag}
                  prompt={prompt.prompt}
                />
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredPrompts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[var(--text-muted)]">No prompts found in this category.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Toast */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-3 bg-[var(--bg-card)] border border-[var(--success)] rounded-[var(--radius-lg)] text-sm font-medium shadow-[var(--shadow-lg)] transition-all duration-300 z-[1001] ${
          copiedToast 
            ? 'translate-y-0 opacity-100 visible' 
            : 'translate-y-4 opacity-0 invisible'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[var(--success)]">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="text-[var(--text-primary)]">Copied to clipboard</span>
      </div>
    </div>
  )
}
