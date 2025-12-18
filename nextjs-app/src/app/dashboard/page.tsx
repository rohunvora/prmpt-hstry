'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { 
  Plus, 
  DollarSign, 
  Eye, 
  ShoppingCart, 
  ExternalLink,
  Settings,
  LogOut,
  Loader2
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Showcase } from '@/lib/types'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showcases, setShowcases] = useState<Showcase[]>([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalViews: 0,
    totalSales: 0,
  })
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUser(user)
      
      // In production: Fetch user's showcases from Supabase
      // For now, show mock data
      setShowcases([])
      setStats({
        totalEarnings: 0,
        totalViews: 0,
        totalSales: 0,
      })
      
      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleStripeConnect = () => {
    // In production: Redirect to Stripe Connect onboarding
    alert('Stripe Connect integration coming soon!\n\nThis will allow you to receive payouts for your showcase sales.')
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-6xl mx-auto px-8 py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Creator Dashboard</h1>
            <p className="text-text-secondary">
              Manage your showcases and track earnings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleStripeConnect}
              className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-subtle rounded-xl text-sm font-medium text-text-secondary hover:border-border-medium hover:text-text-primary transition-all"
            >
              <Settings size={16} />
              Setup Payouts
            </button>
            <Link
              href="/export"
              className="flex items-center gap-2 px-4 py-2 bg-accent-primary rounded-xl text-sm font-semibold text-black hover:bg-accent-secondary transition-all no-underline"
            >
              <Plus size={16} />
              New Showcase
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent-glow flex items-center justify-center">
                <DollarSign size={20} className="text-accent-primary" />
              </div>
              <span className="text-sm text-text-muted">Total Earnings</span>
            </div>
            <div className="text-3xl font-bold">${(stats.totalEarnings / 100).toFixed(2)}</div>
          </div>
          
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent-glow flex items-center justify-center">
                <Eye size={20} className="text-accent-primary" />
              </div>
              <span className="text-sm text-text-muted">Total Views</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalViews}</div>
          </div>
          
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent-glow flex items-center justify-center">
                <ShoppingCart size={20} className="text-accent-primary" />
              </div>
              <span className="text-sm text-text-muted">Total Sales</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalSales}</div>
          </div>
        </div>

        {/* Showcases */}
        <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle">
            <h2 className="text-lg font-semibold">Your Showcases</h2>
          </div>
          
          {showcases.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bg-secondary flex items-center justify-center">
                <Plus size={24} className="text-text-muted" />
              </div>
              <h3 className="text-lg font-medium mb-2">No showcases yet</h3>
              <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
                Export your Cursor chat history and create your first showcase. 
                Start earning from your prompt engineering expertise.
              </p>
              <Link
                href="/export"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary rounded-xl text-base font-semibold text-black hover:bg-accent-secondary transition-all no-underline"
              >
                <Plus size={18} />
                Create Your First Showcase
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {showcases.map((showcase) => (
                <div 
                  key={showcase.id}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-bg-card-hover transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{showcase.title}</h3>
                    <p className="text-sm text-text-muted">
                      {showcase.stats.prompts} prompts • ${(showcase.price_cents / 100).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      showcase.is_published 
                        ? 'bg-success-light text-success'
                        : 'bg-bg-secondary text-text-muted'
                    }`}>
                      {showcase.is_published ? 'Published' : 'Draft'}
                    </span>
                    <Link 
                      href={`/showcase/${showcase.id}`}
                      className="p-2 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <ExternalLink size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Section */}
        <div className="mt-8 p-4 bg-bg-card border border-border-subtle rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg bg-gradient-to-br from-accent-primary to-warning text-white"
            >
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div>
              <div className="font-medium">{user?.email}</div>
              <div className="text-sm text-text-muted">Creator account</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </main>

      <Footer />
    </>
  )
}
