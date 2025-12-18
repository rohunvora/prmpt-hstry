import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Header />
      
      <main className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-text-secondary">
          <p className="text-sm text-text-muted">Last updated: December 2024</p>
          
          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">Account Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address (required for account creation)</li>
              <li>Username and display name (optional)</li>
              <li>GitHub profile information (if you sign in with GitHub)</li>
            </ul>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">Content You Upload</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Showcase titles, descriptions, and pricing</li>
              <li>Prompt histories that you choose to upload and sell</li>
            </ul>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">Usage Data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pages visited and features used</li>
              <li>Purchase history</li>
              <li>IP address and browser information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain the Service</li>
              <li>To process transactions and send related information</li>
              <li>To send you technical notices and support messages</li>
              <li>To respond to your comments and questions</li>
              <li>To analyze usage and improve our Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">3. Export Wizard Privacy</h2>
            <p>
              When you use our Export Wizard to prepare your Cursor chat history:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>100% Client-Side Processing:</strong> Your chat history is processed entirely in your browser</li>
              <li><strong>No Automatic Upload:</strong> Nothing is sent to our servers until you explicitly submit</li>
              <li><strong>Redaction Tools:</strong> We provide tools to automatically detect and redact sensitive information</li>
              <li><strong>You Choose What to Share:</strong> You select exactly which messages to include</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">4. Information Sharing</h2>
            <p>We do not sell your personal information. We may share information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe:</strong> For payment processing</li>
              <li><strong>Supabase:</strong> For authentication and data storage</li>
              <li><strong>Analytics providers:</strong> For anonymous usage statistics</li>
              <li><strong>Law enforcement:</strong> If required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information. However, no method of 
              transmission over the Internet is 100% secure. We use:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>HTTPS encryption for all data transmission</li>
              <li>Row-level security in our database</li>
              <li>Secure authentication through Supabase</li>
              <li>Private storage buckets for paid content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">7. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. We may use analytics 
              cookies to understand how you use the Service. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">8. Contact Us</h2>
            <p>
              For privacy-related questions, please contact us at{' '}
              <a href="mailto:privacy@prompt.gallery" className="text-accent-primary">
                privacy@prompt.gallery
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
