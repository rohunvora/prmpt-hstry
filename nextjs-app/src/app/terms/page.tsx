import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Header />
      
      <main className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-text-secondary">
          <p className="text-sm text-text-muted">Last updated: December 2024</p>
          
          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using prompt.gallery (&quot;the Service&quot;), you agree to be bound by these Terms of Service. 
              If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">2. Description of Service</h2>
            <p>
              prompt.gallery is a marketplace where users can share and purchase AI prompt histories (conversations 
              with AI assistants like Claude, ChatGPT, and Cursor). Creators can monetize their prompt engineering 
              expertise by selling their complete conversation histories.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old to use this Service</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You may not use another person&apos;s account without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">4. Content Guidelines</h2>
            <p>When uploading showcases, you agree that your content:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Is your own original work or you have rights to share it</li>
              <li>Does not contain sensitive personal information (API keys, passwords, private data)</li>
              <li>Does not violate any laws or third-party rights</li>
              <li>Does not contain malicious code or harmful content</li>
              <li>Is accurately described and categorized</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">5. Purchases and Payments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All purchases are final and non-refundable unless the content is significantly misrepresented</li>
              <li>Prices are set by creators and displayed in USD</li>
              <li>Payment processing is handled by Stripe</li>
              <li>We take a 15% platform fee on all sales</li>
              <li>Creator payouts are processed through Stripe Connect</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">6. Intellectual Property</h2>
            <p>
              Creators retain ownership of their prompt histories. By uploading content, you grant prompt.gallery 
              a license to display previews and facilitate sales. Buyers receive a personal-use license to the 
              purchased content but may not redistribute or resell it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">7. Limitation of Liability</h2>
            <p>
              prompt.gallery is provided &quot;as is&quot; without warranties of any kind. We are not liable for any 
              damages arising from your use of the Service, including but not limited to the accuracy or 
              usefulness of purchased content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of significant 
              changes via email or through the Service. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">9. Contact</h2>
            <p>
              For questions about these Terms, please contact us at{' '}
              <a href="mailto:support@prompt.gallery" className="text-accent-primary">
                support@prompt.gallery
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
