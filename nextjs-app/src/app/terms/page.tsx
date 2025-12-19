/**
 * Terms of Service Page - cursorhabits
 */

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Header />
      
      <main className="max-w-3xl mx-auto px-6 py-24 pt-32">
        <h1 className="text-3xl font-display font-bold mb-8 text-text-primary">Terms of Service</h1>
        
        <div className="prose max-w-none space-y-6 text-text-secondary">
          <p className="text-sm text-text-muted">Last updated: December 2024</p>
          
          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">1. The Tool</h2>
            <p>
              cursorhabits is an open source CLI tool that extracts patterns from your Cursor chat history.
              It&apos;s provided &quot;as is&quot; without warranties. Use at your own discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">2. Your Data</h2>
            <p>
              The tool reads from your local Cursor database. You&apos;re responsible for any rules you generate and where you share them. 
              Don&apos;t include sensitive information (API keys, passwords) in your .cursorrules files.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">3. The Website</h2>
            <p>
              This website provides documentation and a collection of prompts. The prompts are provided for 
              educational purposes. No guarantees about their effectiveness for your specific use case.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">4. Limitations</h2>
            <p>
              cursorhabits works by reading Cursor&apos;s internal database format. If Cursor changes how they 
              store data, the tool may break. We&apos;ll do our best to keep it updated, but no guarantees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">5. Open Source</h2>
            <p>
              The cursorhabits CLI is open source under the MIT license. Feel free to fork, modify, 
              and contribute.{' '}
              <a 
                href="https://github.com/rohunvora/prmpt-hstry/tree/main/cursor-habits" 
                className="text-accent-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">6. Contact</h2>
            <p>
              Questions about these terms? Reach out via{' '}
              <a href="https://twitter.com/rohunvora" className="text-accent-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Twitter/X
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
