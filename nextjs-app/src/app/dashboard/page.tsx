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
  Loader2,
  TrendingUp
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
    alert('Stripe Connect integration coming soon!\n\nThis will allow you to receive payouts for your showcase sales.')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Creator Dashboard</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Manage your showcases and track earnings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleStripeConnect}
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)] transition-all"
              >
                <Settings size={16} />
                Setup Payouts
              </button>
              <Link
                href="/export"
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-primary)] rounded-[var(--radius-lg)] text-sm font-semibold text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] transition-all"
              >
                <Plus size={16} />
                New Showcase
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard 
              icon={DollarSign}
              label="Total Earnings"
              value={`$${(stats.totalEarnings / 100).toFixed(2)}`}
            />
            <StatCard 
              icon={Eye}
              label="Total Views"
              value={stats.totalViews.toString()}
            />
            <StatCard 
              icon={ShoppingCart}
              label="Total Sales"
              value={stats.totalSales.toString()}
            />
          </div>

          {/* Showcases */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Your Showcases</h2>
              <span className="text-sm text-[var(--text-dim)]">{showcases.length} total</span>
            </div>
            
            {showcases.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-[var(--radius-xl)] bg-[var(--bg-secondary)] flex items-center justify-center">
                  <TrendingUp size={24} className="text-[var(--text-dim)]" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">No showcases yet</h3>
                <p className="text-sm text-[var(--text-muted)] mb-6 max-w-sm mx-auto leading-relaxed">
                  Export your Cursor chat history and create your first showcase. Start earning from your prompt engineering expertise.
                </p>
                <Link
                  href="/export"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] rounded-[var(--radius-lg)] text-sm font-semibold text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] transition-all"
                >
                  <Plus size={18} />
                  Create Your First Showcase
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-subtle)]">
                {showcases.map((showcase) => (
                  <div 
                    key={showcase.id}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--bg-card-hover)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[var(--text-primary)] truncate">{showcase.title}</h3>
                      <p className="text-sm text-[var(--text-dim)]">
                        {showcase.stats.prompts} prompts • ${(showcase.price_cents / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-[var(--radius-md)] ${
                        showcase.is_published 
                          ? 'bg-[var(--success-subtle)] text-[var(--success)]'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-dim)]'
                      }`}>
                        {showcase.is_published ? 'Published' : 'Draft'}
                      </span>
                      <Link 
                        href={`/showcase/${showcase.id}`}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] hover:bg-[var(--bg-secondary)] transition-all"
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
          <div className="mt-6 p-5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-base bg-gradient-to-br from-[var(--accent-primary)] to-amber-500 text-[var(--bg-primary)]"
              >
                {user?.email?.[0].toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-medium text-[var(--text-primary)]">{user?.email}</div>
                <div className="text-sm text-[var(--text-dim)]">Creator account</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] hover:bg-[var(--bg-secondary)] transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

interface StatCardProps {
  icon: typeof DollarSign
  label: string
  value: string
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-[var(--radius-lg)] bg-[var(--accent-subtle)] flex items-center justify-center">
          <Icon size={18} className="text-[var(--accent-primary)]" />
        </div>
        <span className="text-sm text-[var(--text-dim)]">{label}</span>
      </div>
      <div className="text-2xl font-bold text-[var(--text-primary)]">{value}</div>
    </div>
  )
}
