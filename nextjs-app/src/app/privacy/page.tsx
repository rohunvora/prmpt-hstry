/**
 * Privacy Policy Page - cursorhabits
 */

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Header />
      
      <main className="max-w-3xl mx-auto px-6 py-24 pt-32">
        <h1 className="text-3xl font-display font-bold mb-8 text-text-primary">Privacy Policy</h1>
        
        <div className="prose max-w-none space-y-6 text-text-secondary">
          <p className="text-sm text-text-muted">Last updated: December 2024</p>
          
          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">Summary</h2>
            <p className="bg-accent-light p-4 rounded-lg border border-border-subtle">
              <strong className="text-text-primary">cursorhabits is 100% local.</strong> The CLI tool reads from your local Cursor database and never sends any data anywhere. No accounts, no telemetry, no analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">What We Collect</h2>
            <p>
              <strong>From the CLI tool:</strong> Nothing. It runs entirely on your machine.
            </p>
            <p>
              <strong>From this website:</strong> Standard web server logs (IP address, browser type, pages visited). 
              We don&apos;t use analytics or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">Your Data</h2>
            <p>
              The cursorhabits CLI reads Cursor&apos;s local SQLite database to find patterns in your chat history. 
              This data stays on your machine. The generated rules file is saved locally—you choose if and where to share it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">Open Source</h2>
            <p>
              cursorhabits is open source. You can{' '}
              <a 
                href="https://github.com/rohunvora/prmpt-hstry/blob/main/cursor-habits/cursor_habits.py" 
                className="text-accent-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                read the source code
              </a>{' '}
              to verify exactly what it does. It&apos;s about 200 lines of Python.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">Contact</h2>
            <p>
              Questions? Reach out via{' '}
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
