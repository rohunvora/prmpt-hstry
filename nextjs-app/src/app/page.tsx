/**
 * cursorhabits Landing Page
 * 
 * Warm, illustrated aesthetic with developer functionality.
 * Hero → Problem → How it works → Example → Privacy → CTA → Prompts
 */

'use client';

import { useState } from 'react';
import { Github, Terminal, FileText, Copy, Check, ArrowRight, Shield, Zap, RefreshCw } from 'lucide-react';
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

  // Take first 6 prompts for display
  const featuredPrompts = allPrompts.slice(0, 6);

  return (
    <>
      <Header />
      
      <main>
        {/* ============================================
            HERO SECTION
            ============================================ */}
        <section className="relative min-h-screen bg-gradient-hero overflow-hidden pt-24">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="blob blob-coral w-96 h-96 -top-20 -right-20 opacity-30" />
            <div className="blob blob-sage w-80 h-80 top-1/3 -left-20 opacity-20" />
            <div className="blob blob-gold w-64 h-64 bottom-20 right-1/4 opacity-25" />
          </div>

          <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-40">
            {/* Badge */}
            <div className="flex justify-center mb-8 animate-fadeIn">
              <span className="badge">100% Local • Privacy First</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-center text-text-primary mb-6 animate-fadeIn delay-1">
              Your chat history<br />
              <span className="text-text-primary">writes your rules</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg sm:text-xl text-text-secondary text-center max-w-2xl mx-auto mb-12 animate-fadeIn delay-2">
              Stop telling Cursor the same things. Extract your habits, 
              generate .cursorrules, and finally work with an AI that remembers.
            </p>

            {/* Install Command */}
            <div className="max-w-lg mx-auto mb-16 animate-fadeIn delay-3">
              <InstallCommand command="python cursor_habits.py" />
            </div>

            {/* Terminal Preview */}
            <div className="max-w-3xl mx-auto animate-slideUp delay-4">
              <TerminalMockup />
            </div>
          </div>
        </section>

        {/* ============================================
            PROBLEM SECTION
            ============================================ */}
        <section className="py-20 bg-bg-primary">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-4">
                Sound familiar?
              </h2>
            </div>

            <div className="bg-bg-card border border-border-subtle rounded-xl p-8 sm:p-12">
              <div className="font-mono text-sm sm:text-base space-y-4 text-text-secondary">
                <p className="text-text-muted">You, to Cursor, for the 127th time:</p>
                <p className="text-accent-primary">"Push to GitHub after every change"</p>
                <p className="text-accent-primary">"Don't test locally, deploy to Vercel"</p>
                <p className="text-accent-primary">"Always check mobile"</p>
                <p className="text-accent-primary">"Add that key to .env"</p>
                <p className="text-text-muted mt-6">
                  These are your habits. You shouldn't have to repeat them.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-text-secondary">
                <strong className="text-text-primary">cursorhabits</strong> finds these patterns 
                and turns them into rules Cursor actually follows.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            HOW IT WORKS
            ============================================ */}
        <section className="py-28 bg-gradient-subtle">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-4">
                Three steps. Done.
              </h2>
              <p className="text-text-secondary text-lg">
                No cloud. No API keys. Just a Python script.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 - Coral accent */}
              <div className="card p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-accent-light flex items-center justify-center mx-auto mb-6">
                  <Terminal className="text-accent-primary" size={28} />
                </div>
                <div className="font-mono text-xs text-accent-primary mb-2">01</div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-3">Run</h3>
                <p className="text-text-secondary">
                  One command. Scans your local Cursor database for chat patterns.
                </p>
              </div>

              {/* Step 2 - Sage accent */}
              <div className="card p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-accent-secondary/20 flex items-center justify-center mx-auto mb-6">
                  <FileText className="text-accent-secondary" size={28} />
                </div>
                <div className="font-mono text-xs text-accent-primary mb-2">02</div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-3">Review</h3>
                <p className="text-text-secondary">
                  See what patterns were detected. Edit the generated rules if needed.
                </p>
              </div>

              {/* Step 3 - Gold accent */}
              <div className="card p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-accent-tertiary/30 flex items-center justify-center mx-auto mb-6">
                  <Copy className="text-amber-700" size={28} />
                </div>
                <div className="font-mono text-xs text-accent-primary mb-2">03</div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-3">Paste</h3>
                <p className="text-text-secondary">
                  Copy into your .cursorrules file. Cursor now knows your preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            EXAMPLE OUTPUT
            ============================================ */}
        <section className="py-20 bg-bg-primary">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-4">
                What you get
              </h2>
              <p className="text-text-secondary text-lg">
                Real rules extracted from real habits
              </p>
            </div>

            <div className="bg-bg-code rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-terminal-muted text-sm ml-3 font-mono">suggested_rules.md</span>
              </div>
              <pre className="p-6 text-sm font-mono text-terminal-text overflow-x-auto">
                <code>{`# Deployment Workflow

## When This Applies
- Any time you make code changes that should go live
- After completing a feature, fix, or meaningful update

## GitHub Flow
- Push to GitHub after EVERY meaningful change
- Don't wait to be asked
- Commit from the rohunvora account

## Vercel Flow
- Do NOT test locally
- Push to Vercel and test on production URL
- After deploying, share the live link immediately

## Required Sequence
1. Make change
2. Push to GitHub  
3. Deploy to Vercel
4. Share live URL
5. Update README`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* ============================================
            PRIVACY SECTION
            ============================================ */}
        <section className="py-16 bg-gradient-subtle">
          <div className="max-w-4xl mx-auto px-6">
            <div className="card p-8 sm:p-12 flex flex-col sm:flex-row items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-accent-secondary/20 flex items-center justify-center flex-shrink-0">
                <Shield className="text-accent-secondary" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-text-primary mb-4">
                  100% local. Your data never leaves your machine.
                </h3>
                <p className="text-text-secondary mb-4">
                  cursorhabits reads from Cursor's local SQLite database. Nothing is sent anywhere.
                  No accounts, no API keys, no telemetry. View the source—it's 200 lines of Python.
                </p>
                <a 
                  href="https://github.com/rohunvora/prmpt-hstry/blob/main/cursor-habits/cursor_habits.py"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent-primary hover:underline"
                >
                  Read the code <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            CTA SECTION
            ============================================ */}
        <section className="py-28 bg-bg-primary">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-6">
              Ready to stop repeating yourself?
            </h2>
            <p className="text-text-secondary text-lg mb-10">
              Clone the repo and run the script. Takes about 30 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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

            <p className="text-sm text-text-muted">
              Requires Python 3.8+ and Cursor installed
            </p>
          </div>
        </section>

        {/* ============================================
            PROMPTS I LIKE
            ============================================ */}
        <section className="py-32 bg-gradient-subtle">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="badge mb-4">Bonus</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-4">
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
              <div className="text-center mt-12">
                <p className="text-text-muted text-sm">
                  {allPrompts.length - 6} more prompts available • 
                  <a href="#" className="text-accent-primary hover:underline ml-1">View all</a>
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
