'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { seedShowcases } from '@/lib/seed-showcases'
import { 
  Lock, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  ArrowLeft,
  Download,
  Copy,
  Check,
  CreditCard
} from 'lucide-react'
import type { Showcase, Message } from '@/lib/types'

export default function ShowcaseDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [showcase, setShowcase] = useState<Showcase | null>(null)
  const [isPurchased, setIsPurchased] = useState(false)
  const [showCheckout, setShowCheckout] = useState(searchParams.get('unlock') === 'true')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    // In production, fetch from Supabase
    const found = seedShowcases.find(s => s.id === params.id)
    setShowcase(found || null)
  }, [params.id])

  if (!showcase) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Showcase not found</h1>
          <Link href="/showcases" className="text-accent-primary">
            ← Back to showcases
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  const priceFormatted = (showcase.price_cents / 100).toFixed(2)
  
  // For demo: show more messages if "purchased"
  const visibleMessages = isPurchased 
    ? [...showcase.preview_messages, ...generateMockMessages(showcase.stats.prompts - showcase.preview_messages.length)]
    : showcase.preview_messages

  const handlePurchase = () => {
    // In production: Create Stripe checkout session
    alert('Stripe integration coming soon!\n\nThis will redirect to Stripe Checkout.')
    // For demo purposes:
    setIsPurchased(true)
    setShowCheckout(false)
  }

  const copyMessage = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <>
      <Header />

      <main className="max-w-4xl mx-auto px-8 py-8">
        {/* Back button */}
        <Link 
          href="/showcases" 
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-8 no-underline"
        >
          <ArrowLeft size={16} />
          Back to showcases
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[0.65rem] font-medium uppercase tracking-wide px-2 py-1 bg-accent-light text-accent-primary rounded-lg">
              {showcase.category}
            </span>
            {isPurchased && (
              <span className="font-mono text-[0.65rem] font-medium uppercase tracking-wide px-2 py-1 bg-success-light text-success rounded-lg">
                ✓ Purchased
              </span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-3">{showcase.title}</h1>
          <p className="text-lg text-text-secondary leading-relaxed">{showcase.description}</p>
        </div>

        {/* Stats & Creator */}
        <div className="flex flex-wrap items-center gap-6 p-4 bg-bg-card border border-border-subtle rounded-2xl mb-8">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-text-muted" />
            <span className="font-semibold">{showcase.stats.prompts}</span>
            <span className="text-sm text-text-muted">prompts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-text-muted" />
            <span className="font-semibold">{showcase.stats.iterations}</span>
            <span className="text-sm text-text-muted">iterations</span>
          </div>
          {showcase.stats.hours && (
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-text-muted" />
              <span className="font-semibold">{showcase.stats.hours}</span>
              <span className="text-sm text-text-muted">hours</span>
            </div>
          )}
          
          <div className="flex-1" />
          
          {showcase.creator && (
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-gradient-to-br from-accent-primary to-warning text-white"
              >
                {showcase.creator.display_name?.[0] || 'A'}
              </div>
              <div>
                <div className="font-medium">{showcase.creator.display_name || 'Anonymous'}</div>
                <div className="text-xs text-text-muted">Creator</div>
              </div>
            </div>
          )}
        </div>

        {/* Conversation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            {isPurchased ? (
              <>
                <Eye size={20} />
                Full Conversation
              </>
            ) : (
              <>
                <Eye size={20} />
                Preview ({showcase.preview_messages.length} of {showcase.stats.prompts} messages)
              </>
            )}
          </h2>

          <div className="space-y-4">
            {visibleMessages.map((msg, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-bg-primary border border-border-subtle border-l-[3px] border-l-accent-primary'
                    : 'bg-bg-secondary border border-border-subtle'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-[0.65rem] font-semibold uppercase tracking-wide ${
                    msg.role === 'user' ? 'text-accent-primary' : 'text-text-muted'
                  }`}>
                    {msg.role === 'user' ? 'You' : 'AI'}
                  </span>
                  {isPurchased && (
                    <button
                      onClick={() => copyMessage(msg.content, index)}
                      className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                      title="Copy message"
                    >
                      {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
                <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Locked Content */}
          {!isPurchased && (
            <div className="relative mt-4 p-8 rounded-xl bg-gradient-to-b from-transparent to-bg-primary text-center">
              <div className="flex items-center justify-center gap-2 text-text-muted mb-4">
                <Lock size={20} />
                <span>{showcase.stats.prompts - showcase.preview_messages.length} more messages locked</span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary rounded-xl text-base font-semibold text-black hover:bg-accent-secondary transition-all"
              >
                <Lock size={18} />
                Unlock for ${priceFormatted}
              </button>
            </div>
          )}
        </div>

        {/* Actions for purchased */}
        {isPurchased && (
          <div className="flex gap-4 p-4 bg-bg-card border border-border-subtle rounded-2xl">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-bg-primary border border-border-subtle rounded-xl text-sm font-medium text-text-secondary hover:border-border-medium hover:text-text-primary transition-all">
              <Download size={18} />
              Download JSON
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-bg-primary border border-border-subtle rounded-xl text-sm font-medium text-text-secondary hover:border-border-medium hover:text-text-primary transition-all">
              <Copy size={18} />
              Copy All
            </button>
          </div>
        )}
      </main>

      {/* Checkout Modal */}
      {showCheckout && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 z-[2000]"
          onClick={() => setShowCheckout(false)}
        >
          <div 
            className="bg-bg-card border border-border-subtle rounded-2xl max-w-md w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">Unlock Full Showcase</h2>
            <p className="text-sm text-text-secondary mb-6">
              Get access to all {showcase.stats.prompts} prompts and AI responses.
            </p>
            
            <div className="p-4 bg-bg-primary rounded-xl mb-6">
              <div className="text-3xl font-bold text-center mb-1">${priceFormatted}</div>
              <div className="text-sm text-text-muted text-center">One-time purchase</div>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-success" />
                Full conversation history
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-success" />
                Download as JSON
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-success" />
                Copy individual messages
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-success" />
                Lifetime access
              </li>
            </ul>

            <button
              onClick={handlePurchase}
              className="w-full flex items-center justify-center gap-2 py-3 bg-accent-primary rounded-xl text-base font-semibold text-black hover:bg-accent-secondary transition-all"
            >
              <CreditCard size={18} />
              Purchase with Stripe
            </button>
            
            <p className="text-xs text-text-muted text-center mt-4">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

// Generate mock messages for demo
function generateMockMessages(count: number): Message[] {
  const mockPrompts = [
    'Can you add error handling to that function?',
    'The styling looks off on mobile. Can you fix the responsive layout?',
    'Add a loading state while the data fetches.',
    'Can you optimize this for performance?',
    'Add proper TypeScript types to all the functions.',
    'The animation is too fast. Make it smoother.',
    'Add keyboard navigation support.',
    'Can you refactor this to use React hooks?',
    'Add proper error boundaries.',
    'The dark mode colors need tweaking.',
  ]
  
  const messages: Message[] = []
  for (let i = 0; i < Math.min(count, 20); i++) {
    messages.push({
      role: 'user',
      content: mockPrompts[i % mockPrompts.length]
    })
    messages.push({
      role: 'assistant',
      content: `I'll help you with that. Here's the updated implementation...\n\n[Code implementation would go here with detailed explanation of the changes made and why they improve the solution.]`
    })
  }
  return messages.slice(0, count)
}
