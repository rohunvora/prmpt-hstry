'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ShowcaseCard } from '@/components/ShowcaseCard'
import { seedShowcases } from '@/lib/seed-showcases'
import { Target, Zap, FlaskConical, Plus, ArrowRight } from 'lucide-react'

type Category = 'all' | 'web' | 'design' | 'automation' | 'content'

export default function ShowcasesPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('all')

  const filteredShowcases = activeFilter === 'all'
    ? seedShowcases
    : seedShowcases.filter(s => s.category === activeFilter)

  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'web', label: 'Web Apps' },
    { value: 'design', label: 'Design' },
    { value: 'automation', label: 'Automation' },
    { value: 'content', label: 'Content' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-12 pb-10 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[var(--accent-subtle)] text-[var(--accent-primary)] rounded-[var(--radius-full)] mb-6">
              See them in action
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-4 text-balance">
              Prompts, <span className="text-[var(--accent-primary)]">Proven</span>
            </h1>
            <p className="text-base text-[var(--text-muted)] leading-relaxed">
              Real before/after examples showing exactly what each prompt does.
            </p>
          </div>
        </section>

        {/* Value Props */}
        <section className="px-6 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <ValueCard 
              icon={Target}
              title="Know When to Use It"
              description="Each showcase shows the situation that calls for this prompt."
            />
            <ValueCard 
              icon={Zap}
              title="See the Difference"
              description="Before/after comparisons so you know what to expect."
            />
            <ValueCard 
              icon={FlaskConical}
              title="Real Outputs"
              description="Actual AI responses, not hypothetical examples."
            />
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

        {/* Showcases Grid */}
        <section className="px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredShowcases.map((showcase, index) => (
              <div 
                key={showcase.id}
                data-animate={Math.min(index + 1, 8)}
              >
                <ShowcaseCard 
                  showcase={showcase} 
                  featured={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredShowcases.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[var(--text-muted)]">No showcases found in this category.</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 bg-gradient-to-b from-transparent via-[var(--bg-secondary)]/50 to-[var(--bg-secondary)]">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
              Built something cool with AI?
            </h2>
            <p className="text-base text-[var(--text-muted)] mb-8 leading-relaxed">
              Share your prompt history and earn money when others learn from your journey.
            </p>
            <Link 
              href="/export"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-[var(--radius-lg)] text-base font-semibold hover:bg-[var(--accent-secondary)] transition-all hover:-translate-y-0.5 group"
            >
              <Plus size={18} />
              Submit Your Showcase
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

interface ValueCardProps {
  icon: typeof Target
  title: string
  description: string
}

function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6 text-center transition-all hover:border-[var(--border-medium)] hover:shadow-[var(--shadow-md)]">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--accent-subtle)] mb-4">
        <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
      </div>
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{description}</p>
    </div>
  )
}
