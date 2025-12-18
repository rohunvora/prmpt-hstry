import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { ArrowRight, Target, DollarSign, Shield, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Header />
      
      <main>
        {/* Hero */}
        <section className="text-center px-8 py-16 max-w-4xl mx-auto">
          <h1 
            className="text-5xl font-bold tracking-tight mb-4 text-text-primary"
          >
            The First Marketplace for Prompt Journeys
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Not just prompts. The entire conversation. See what&apos;s possible with AI, 
            pay to learn <em className="text-accent-primary not-italic">exactly</em> how.
          </p>
        </section>

        {/* Problem/Solution */}
        <section className="px-8 py-12 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-4 text-red-400">The Problem</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Prompt marketplaces sell single prompts for $2-10. But a single prompt doesn&apos;t teach you 
                how to iterate, debug, or refine your approach when things don&apos;t work.
              </p>
              <p className="text-text-secondary leading-relaxed">
                The real skill in AI development is the conversation—the back-and-forth that turns a 
                vague idea into a working solution.
              </p>
            </div>
            
            <div className="bg-bg-card border border-accent-primary rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-4 text-accent-primary">Our Solution</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                prompt.gallery lets creators sell their complete AI conversation histories—every 
                prompt, every response, every iteration.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Buyers get to see exactly how an expert built something start to finish. 
                No cherry-picking, no cleaned-up versions. The real journey.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-8 py-16 bg-bg-secondary">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-light flex items-center justify-center text-2xl font-bold text-accent-primary">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Export Your History</h3>
                <p className="text-sm text-text-secondary">
                  Use our secure wizard to export your Cursor, ChatGPT, or Claude conversation. 
                  Redact sensitive info with one click.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-light flex items-center justify-center text-2xl font-bold text-accent-primary">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Set Your Price</h3>
                <p className="text-sm text-text-secondary">
                  Choose what to charge. Keep 85% of every sale. 
                  Buyers see a free preview before purchasing.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-light flex items-center justify-center text-2xl font-bold text-accent-primary">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Earn Passively</h3>
                <p className="text-sm text-text-secondary">
                  Your expertise keeps earning. Get paid every time someone 
                  wants to learn from your approach.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-8 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why prompt.gallery?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-6 bg-bg-card border border-border-subtle rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">See Real Results</h3>
                <p className="text-sm text-text-secondary">
                  Every showcase shows a working result—a live site, a shipped feature, 
                  a completed project. No vaporware.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 bg-bg-card border border-border-subtle rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Fair Creator Economics</h3>
                <p className="text-sm text-text-secondary">
                  Creators keep 85% of sales—more than Gumroad, Patreon, or other platforms. 
                  Direct payouts via Stripe Connect.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 bg-bg-card border border-border-subtle rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Privacy-First Export</h3>
                <p className="text-sm text-text-secondary">
                  Our export wizard runs entirely in your browser. Auto-redact API keys, 
                  emails, and file paths before uploading.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 bg-bg-card border border-border-subtle rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Learn Faster</h3>
                <p className="text-sm text-text-secondary">
                  Skip the tutorial hell. See exactly how an expert would approach 
                  your problem, including the mistakes and fixes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-8 py-16 bg-gradient-to-b from-transparent to-bg-secondary">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-lg text-text-secondary mb-8">
              Browse showcases to learn from experts, or upload your own to start earning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/showcases"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-primary rounded-xl text-base font-semibold text-black hover:bg-accent-secondary transition-all no-underline"
              >
                Browse Showcases
                <ArrowRight size={18} />
              </Link>
              <Link 
                href="/export"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-bg-card border border-border-subtle rounded-xl text-base font-medium hover:border-border-medium transition-all no-underline"
              >
                Upload Yours
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
