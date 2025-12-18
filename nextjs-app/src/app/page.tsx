'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PromptCard } from '@/components/PromptCard'
import { prompts } from '@/lib/prompts-data'
import { Search } from 'lucide-react'

type Category = 'all' | 'coding' | 'writing' | 'analysis' | 'creative' | 'system'

export default function PromptsPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedToast, setCopiedToast] = useState(false)

  const filteredPrompts = useMemo(() => {
    let filtered = prompts
    
    // Filter by category
    if (activeFilter !== 'all') {
      filtered = filtered.filter(p => p.category === activeFilter)
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.prompt.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [activeFilter, searchQuery])

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
        <section className="pt-16 pb-12 px-6 md:pt-20 md:pb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6">
              Prompts that actually work
            </h1>
            <p className="text-lg text-text-secondary mb-12">
              Curated collection of battle-tested prompts. Click to copy, paste to use.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-20">
              <Search 
                size={20} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" 
              />
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-bg-card border border-border-subtle rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <nav className="flex justify-center flex-wrap gap-3 px-6 pb-16">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`text-sm font-medium px-4 py-2 rounded-full border transition-all duration-150 ${
                activeFilter === cat.value
                  ? 'bg-text-primary text-bg-card border-text-primary'
                  : 'bg-bg-card text-text-secondary border-border-subtle hover:border-border-medium hover:text-text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Results count */}
        {searchQuery && (
          <div className="text-center pb-6">
            <span className="text-sm text-text-muted">
              {filteredPrompts.length} {filteredPrompts.length === 1 ? 'result' : 'results'} found
            </span>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-8 md:px-16 pb-32 max-w-7xl mx-auto">
          {filteredPrompts.map((prompt, index) => (
            <div 
              key={prompt.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
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
            <p className="text-text-muted">No prompts found matching your search.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              className="mt-4 text-accent-primary hover:text-accent-secondary transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Toast */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3.5 bg-bg-card border border-success rounded-xl text-sm font-medium shadow-lg transition-all duration-250 z-[1001] ${
          copiedToast 
            ? 'translate-y-0 opacity-100 visible' 
            : 'translate-y-[100px] opacity-0 invisible'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4.5 h-4.5 text-success">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Copied to clipboard
      </div>
    </div>
  )
}
