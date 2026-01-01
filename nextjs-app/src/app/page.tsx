/**
 * cursorhabits Landing Page
 *
 * NOIR TERMINAL AESTHETIC
 * Cinematic, film noir inspired design.
 * Hero → Problem → How it works → Example → Privacy → CTA → Prompts
 */

'use client';

import { useState } from 'react';
import { Github, ArrowRight, Shield, Scan, FileCode, Clipboard, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TerminalMockup from '@/components/TerminalMockup';
import InstallCommand from '@/components/InstallCommand';
import PromptCard from '@/components/PromptCard';
import { prompts as allPrompts } from '@/lib/prompts-data';

export default function Home() {
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const copyPrompt = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(id);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const featuredPrompts = allPrompts.slice(0, 6);

  return (
    <>
      <Header />

      <main>
        {/* ============================================
            HERO SECTION - Dramatic noir entrance
            ============================================ */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
          {/* Grid pattern background */}
          <div className="absolute inset-0 grid-pattern opacity-50" />

          {/* Radial gradient spotlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,65,0.08)_0%,transparent_70%)]" />

          {/* Animated vertical lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute left-[10%] top-0 w-px h-full bg-gradient-to-b from-transparent via-phosphor/20 to-transparent" />
            <div className="absolute left-[30%] top-0 w-px h-full bg-gradient-to-b from-transparent via-border-subtle to-transparent" />
            <div className="absolute left-[70%] top-0 w-px h-full bg-gradient-to-b from-transparent via-border-subtle to-transparent" />
            <div className="absolute left-[90%] top-0 w-px h-full bg-gradient-to-b from-transparent via-phosphor/20 to-transparent" />
          </div>

          <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
            {/* Badge */}
            <div className="flex justify-center mb-10 animate-fadeIn opacity-0">
              <span className="badge">100% Local &bull; Privacy First</span>
            </div>

            {/* Main headline - dramatic typography */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-8 animate-fadeIn opacity-0 delay-1">
              <span className="block text-text-primary">Your chat history</span>
              <span className="block text-phosphor text-glow">writes your rules</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-14 leading-relaxed animate-fadeIn opacity-0 delay-2">
              Stop telling Cursor the same things. Extract patterns from your chat history,
              generate <span className="text-text-primary font-mono">.cursorrules</span>, and work with an AI that actually remembers.
            </p>

            {/* Install Command */}
            <div className="max-w-lg mx-auto mb-20 animate-fadeIn opacity-0 delay-3">
              <InstallCommand command="python cursor_habits.py" />
            </div>

            {/* Terminal Preview */}
            <div className="max-w-3xl mx-auto animate-slideUp opacity-0 delay-4">
              <TerminalMockup />
            </div>

            {/* Scroll indicator */}
            <div className="mt-20 animate-fadeIn opacity-0 delay-5">
              <ChevronDown className="mx-auto text-text-muted animate-bounce" size={28} />
            </div>
          </div>
        </section>

        {/* ============================================
            PROBLEM SECTION - The pain point
            ============================================ */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-noir-black via-noir-charcoal to-noir-black" />

          <div className="relative max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="font-mono text-sm text-phosphor mb-4 tracking-wider uppercase">The Problem</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary">
                Sound familiar?
              </h2>
            </div>

            {/* Terminal-style problem display */}
            <div className="terminal p-8 sm:p-10">
              <div className="font-mono text-sm sm:text-base space-y-4">
                <p className="text-text-muted">// You, to Cursor, for the 127th time:</p>
                <div className="h-2" />
                <p className="text-phosphor">&gt; "Push to GitHub after every change"</p>
                <p className="text-phosphor">&gt; "Don't test locally, deploy to Vercel"</p>
                <p className="text-phosphor">&gt; "Always check mobile first"</p>
                <p className="text-phosphor">&gt; "Add that API key to .env"</p>
                <p className="text-phosphor">&gt; "Use TypeScript, not JavaScript"</p>
                <div className="h-4" />
                <p className="text-text-muted">
                  // These are your habits. Why repeat them every session?
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-xl text-text-secondary">
                <span className="text-text-primary font-semibold">cursorhabits</span> finds these patterns
                and turns them into rules Cursor follows.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            HOW IT WORKS - Three steps
            ============================================ */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30" />

          <div className="relative max-w-5xl mx-auto px-6">
            <div className="text-center mb-20">
              <p className="font-mono text-sm text-phosphor mb-4 tracking-wider uppercase">How It Works</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
                Three steps. Done.
              </h2>
              <p className="text-text-secondary text-lg">
                No cloud. No API keys. Just a Python script.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="card p-8 group hover-lift">
                <div className="w-16 h-16 rounded-lg bg-phosphor/10 border border-phosphor/20 flex items-center justify-center mb-6 group-hover:border-phosphor/40 transition-colors">
                  <Scan className="text-phosphor" size={28} />
                </div>
                <div className="font-mono text-xs text-phosphor mb-3 tracking-widest">01</div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-4">Run</h3>
                <p className="text-text-secondary leading-relaxed">
                  One command scans your local Cursor database for recurring chat patterns.
                </p>
              </div>

              {/* Step 2 */}
              <div className="card p-8 group hover-lift">
                <div className="w-16 h-16 rounded-lg bg-amber/10 border border-amber/20 flex items-center justify-center mb-6 group-hover:border-amber/40 transition-colors">
                  <FileCode className="text-amber" size={28} />
                </div>
                <div className="font-mono text-xs text-phosphor mb-3 tracking-widest">02</div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-4">Review</h3>
                <p className="text-text-secondary leading-relaxed">
                  See the detected patterns. Edit the generated rules if you want.
                </p>
              </div>

              {/* Step 3 */}
              <div className="card p-8 group hover-lift">
                <div className="w-16 h-16 rounded-lg bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center mb-6 group-hover:border-electric-blue/40 transition-colors">
                  <Clipboard className="text-electric-blue" size={28} />
                </div>
                <div className="font-mono text-xs text-phosphor mb-3 tracking-widest">03</div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-4">Paste</h3>
                <p className="text-text-secondary leading-relaxed">
                  Copy into your .cursorrules file. Cursor now knows your preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            EXAMPLE OUTPUT
            ============================================ */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-noir-black via-noir-charcoal to-noir-black" />

          <div className="relative max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="font-mono text-sm text-phosphor mb-4 tracking-wider uppercase">Example Output</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
                What you get
              </h2>
              <p className="text-text-secondary text-lg">
                Real rules extracted from real habits
              </p>
            </div>

            <div className="terminal overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-text-muted text-sm ml-4 font-mono">suggested_rules.md</span>
              </div>
              <pre className="p-6 text-sm font-mono overflow-x-auto">
                <code className="text-text-secondary">
                  <span className="text-phosphor"># Deployment Workflow</span>{'\n\n'}
                  <span className="text-text-muted">## When This Applies</span>{'\n'}
                  <span className="text-text-secondary">- Any time you make code changes that should go live</span>{'\n'}
                  <span className="text-text-secondary">- After completing a feature, fix, or meaningful update</span>{'\n\n'}
                  <span className="text-text-muted">## GitHub Flow</span>{'\n'}
                  <span className="text-text-primary">- Push to GitHub after EVERY meaningful change</span>{'\n'}
                  <span className="text-text-primary">- Don't wait to be asked</span>{'\n'}
                  <span className="text-text-primary">- Commit from the rohunvora account</span>{'\n\n'}
                  <span className="text-text-muted">## Vercel Flow</span>{'\n'}
                  <span className="text-amber">- Do NOT test locally</span>{'\n'}
                  <span className="text-text-primary">- Push to Vercel and test on production URL</span>{'\n'}
                  <span className="text-text-primary">- After deploying, share the live link immediately</span>{'\n\n'}
                  <span className="text-text-muted">## Required Sequence</span>{'\n'}
                  <span className="text-phosphor">1. Make change</span>{'\n'}
                  <span className="text-phosphor">2. Push to GitHub</span>{'\n'}
                  <span className="text-phosphor">3. Deploy to Vercel</span>{'\n'}
                  <span className="text-phosphor">4. Share live URL</span>{'\n'}
                  <span className="text-phosphor">5. Update README</span>
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* ============================================
            PRIVACY SECTION
            ============================================ */}
        <section className="py-24 relative overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-6">
            <div className="card p-10 sm:p-14 flex flex-col sm:flex-row items-start gap-8 border-phosphor/20 hover:border-phosphor/40">
              {/* Shield icon with glow */}
              <div className="w-20 h-20 rounded-xl bg-phosphor/10 border border-phosphor/20 flex items-center justify-center flex-shrink-0">
                <Shield className="text-phosphor" size={36} />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary mb-5">
                  100% local. Your data never leaves.
                </h3>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  cursorhabits reads from Cursor's local SQLite database. Nothing is sent anywhere.
                  No accounts, no API keys, no telemetry. View the source—it's 200 lines of Python.
                </p>
                <a
                  href="https://github.com/rohunvora/prmpt-hstry/blob/main/cursor-habits/cursor_habits.py"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-phosphor hover:gap-3 transition-all font-mono text-sm"
                >
                  Read the source code <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            CTA SECTION
            ============================================ */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-noir-black via-noir-charcoal to-noir-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,65,0.05)_0%,transparent_60%)]" />

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <p className="font-mono text-sm text-phosphor mb-6 tracking-wider uppercase">Get Started</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary mb-8">
              Ready to stop repeating yourself?
            </h2>
            <p className="text-text-secondary text-xl mb-12">
              Clone the repo and run the script. Takes about 30 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a
                href="https://github.com/rohunvora/prmpt-hstry/tree/main/cursor-habits"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Github size={20} />
                View on GitHub
              </a>
              <a
                href="https://github.com/rohunvora/prmpt-hstry/tree/main/cursor-habits#quick-start"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Read the docs
                <ArrowRight size={18} />
              </a>
            </div>

            <p className="text-sm text-text-muted font-mono">
              Requires Python 3.8+ and Cursor installed
            </p>
          </div>
        </section>

        {/* ============================================
            PROMPTS I LIKE
            ============================================ */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-20" />

          <div className="relative max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="badge mb-6">Bonus</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
                Prompts I like
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                A personal collection of prompts I actually use.
                Click to copy. Nothing fancy—just stuff that works.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onCopy={() => copyPrompt(prompt.id, prompt.prompt)}
                  copied={copiedPrompt === prompt.id}
                />
              ))}
            </div>

            {allPrompts.length > 6 && (
              <div className="text-center mt-14">
                <p className="text-text-muted text-sm font-mono">
                  {allPrompts.length - 6} more prompts available &bull;{' '}
                  <a href="#" className="text-phosphor hover:underline">View all</a>
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
