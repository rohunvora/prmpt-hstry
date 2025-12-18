'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { Github, Mail, Loader2 } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubAuth = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setMessage('Check your email for the magic link!')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      
      <main className="max-w-md mx-auto px-8 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-text-secondary">
            {isLogin 
              ? 'Sign in to access your dashboard' 
              : 'Start monetizing your prompt histories'}
          </p>
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
          {/* GitHub Auth */}
          <button
            onClick={handleGitHubAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-bg-primary border border-border-subtle rounded-xl text-base font-medium hover:border-border-medium transition-all disabled:opacity-50"
          >
            <Github size={20} />
            Continue with GitHub
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-sm text-text-muted">or</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 bg-success-light border border-success/20 rounded-xl text-sm text-success">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-accent-primary rounded-xl text-base font-semibold text-black hover:bg-accent-secondary transition-all disabled:opacity-50"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Magic Link */}
          <button
            onClick={handleMagicLink}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 mt-3 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <Mail size={16} />
            Send magic link instead
          </button>

          {/* Toggle */}
          <div className="mt-6 pt-6 border-t border-border-subtle text-center text-sm text-text-secondary">
            {isLogin ? (
              <>
                Don&apos;t have an account?{' '}
                <button 
                  onClick={() => setIsLogin(false)}
                  className="text-accent-primary hover:text-accent-secondary"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => setIsLogin(true)}
                  className="text-accent-primary hover:text-accent-secondary"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
