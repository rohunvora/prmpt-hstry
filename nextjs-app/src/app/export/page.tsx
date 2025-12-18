'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/lib/types'
import {
  Shield,
  Upload,
  MessageSquare,
  Search,
  Send,
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  FileText,
  Trash2
} from 'lucide-react'

type Step = 1 | 2 | 3 | 4 | 5

interface ParsedConversation {
  messages: Message[]
  selected: Set<number>
  redactions: Map<number, Array<{ start: number; end: number }>>
}

export default function ExportPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [conversation, setConversation] = useState<ParsedConversation>({
    messages: [],
    selected: new Set(),
    redactions: new Map()
  })
  const [pasteContent, setPasteContent] = useState('')
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [uploadMessage, setUploadMessage] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web',
    price: '4.99',
    creatorName: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const steps = [
    { num: 1, label: 'Security', icon: Shield },
    { num: 2, label: 'Upload', icon: Upload },
    { num: 3, label: 'Select', icon: MessageSquare },
    { num: 4, label: 'Review', icon: Search },
    { num: 5, label: 'Export', icon: Send },
  ]

  const parseConversation = useCallback((text: string): Message[] => {
    const messages: Message[] = []
    
    try {
      const json = JSON.parse(text)
      if (Array.isArray(json)) {
        json.forEach(msg => {
          if (msg.role && msg.content) {
            messages.push({
              role: msg.role.toLowerCase() as 'user' | 'assistant',
              content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
            })
          }
        })
        return messages
      }
      if (json.messages) return parseConversation(JSON.stringify(json.messages))
      if (json.conversation) return parseConversation(JSON.stringify(json.conversation))
    } catch {
      // Not JSON, try plain text
    }

    const lines = text.split('\n')
    let currentRole: 'user' | 'assistant' | null = null
    let currentContent: string[] = []

    const userPatterns = [/^USER:\s*/i, /^Human:\s*/i, /^You:\s*/i, /^Q:\s*/i, /^>>\s*/]
    const assistantPatterns = [/^ASSISTANT:\s*/i, /^AI:\s*/i, /^A:\s*/i, /^Claude:\s*/i, /^GPT:\s*/i]

    const saveMessage = () => {
      if (currentRole && currentContent.length > 0) {
        messages.push({ role: currentRole, content: currentContent.join('\n').trim() })
        currentContent = []
      }
    }

    lines.forEach(line => {
      let matched = false
      
      for (const pattern of userPatterns) {
        if (pattern.test(line)) {
          saveMessage()
          currentRole = 'user'
          currentContent.push(line.replace(pattern, ''))
          matched = true
          break
        }
      }

      if (!matched) {
        for (const pattern of assistantPatterns) {
          if (pattern.test(line)) {
            saveMessage()
            currentRole = 'assistant'
            currentContent.push(line.replace(pattern, ''))
            matched = true
            break
          }
        }
      }

      if (!matched && currentRole) {
        currentContent.push(line)
      }
    })

    saveMessage()
    return messages
  }, [])

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text()
      const messages = parseConversation(text)
      
      if (messages.length === 0) {
        setUploadStatus('error')
        setUploadMessage('No messages found in file')
        return
      }

      setConversation({
        messages,
        selected: new Set(messages.map((_, i) => i)),
        redactions: new Map()
      })
      setUploadStatus('success')
      setUploadMessage(`Loaded ${messages.length} messages`)
    } catch {
      setUploadStatus('error')
      setUploadMessage('Failed to parse file')
    }
  }

  const handlePaste = () => {
    if (pasteContent.length < 50) return
    
    const messages = parseConversation(pasteContent)
    if (messages.length > 0) {
      setConversation({
        messages,
        selected: new Set(messages.map((_, i) => i)),
        redactions: new Map()
      })
      setUploadStatus('success')
      setUploadMessage(`Parsed ${messages.length} messages`)
    }
  }

  const toggleMessageSelection = (index: number) => {
    const newSelected = new Set(conversation.selected)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setConversation({ ...conversation, selected: newSelected })
  }

  const selectAll = () => {
    setConversation({
      ...conversation,
      selected: new Set(conversation.messages.map((_, i) => i))
    })
  }

  const deselectAll = () => {
    setConversation({ ...conversation, selected: new Set() })
  }

  const autoRedact = () => {
    const newRedactions = new Map(conversation.redactions)
    const patterns = [
      /sk-[a-zA-Z0-9]{20,}/g,
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      /\/Users\/[^\/\s]+/g,
      /\/home\/[^\/\s]+/g,
    ]

    conversation.messages.forEach((msg, i) => {
      if (!conversation.selected.has(i)) return
      
      const ranges: Array<{ start: number; end: number }> = []
      patterns.forEach(pattern => {
        let match
        while ((match = pattern.exec(msg.content)) !== null) {
          ranges.push({ start: match.index, end: match.index + match[0].length })
        }
      })
      
      if (ranges.length > 0) {
        newRedactions.set(i, ranges)
      }
    })

    setConversation({ ...conversation, redactions: newRedactions })
  }

  const clearRedactions = () => {
    setConversation({ ...conversation, redactions: new Map() })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please sign in to submit your showcase')
      router.push('/auth')
      return
    }

    const selectedMessages = conversation.messages
      .filter((_, i) => conversation.selected.has(i))
      .map((msg, i) => {
        let content = msg.content
        const ranges = conversation.redactions.get(i) || []
        ranges.sort((a, b) => b.start - a.start)
        ranges.forEach(range => {
          content = content.substring(0, range.start) + '[REDACTED]' + content.substring(range.end)
        })
        return { role: msg.role, content }
      })

    const exportData = {
      meta: {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        creator: formData.creatorName || user.email,
        exportedAt: new Date().toISOString(),
        stats: {
          totalMessages: selectedMessages.length,
          userPrompts: selectedMessages.filter(m => m.role === 'user').length,
          redactedItems: Array.from(conversation.redactions.values()).reduce((sum, arr) => sum + arr.length, 0)
        }
      },
      messages: selectedMessages
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `showcase-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsSubmitting(false)
    alert('Showcase exported! Full submission to gallery coming soon.')
  }

  const canProceed = () => {
    switch (currentStep) {
      case 2: return conversation.messages.length > 0
      case 3: return conversation.selected.size > 0
      case 5: return formData.title.length > 0 && formData.description.length > 0
      default: return true
    }
  }

  const nextStep = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    currentStep === step.num
                      ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
                      : currentStep > step.num
                      ? 'bg-[var(--success)] text-white'
                      : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-dim)]'
                  }`}>
                    {currentStep > step.num ? <Check size={18} /> : step.num}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep === step.num ? 'text-[var(--accent-primary)]' : 'text-[var(--text-dim)]'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-3 mb-6 rounded-full ${
                    currentStep > step.num ? 'bg-[var(--success)]' : 'bg-[var(--border-subtle)]'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Security */}
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-10">
                <div className="w-16 h-16 mx-auto mb-5 rounded-[var(--radius-2xl)] bg-[var(--accent-subtle)] flex items-center justify-center">
                  <Lock size={28} className="text-[var(--accent-primary)]" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Your Privacy Comes First</h1>
                <p className="text-[var(--text-muted)]">Before we start, here&apos;s exactly what happens with your data.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <InfoCard icon="💻" title="100% Client-Side" description="Your chat history is processed entirely in your browser." />
                <InfoCard icon="👁️" title="Preview Before Sharing" description="See exactly what will be shared and redact anything." />
                <InfoCard icon="🗑️" title="Nothing Stored" description="Close this tab and everything is gone." />
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6">
                <h3 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-4">What we access:</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <CheckCircle size={18} className="text-[var(--success)] flex-shrink-0" />
                    Your Cursor conversation history (the file you provide)
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <CheckCircle size={18} className="text-[var(--success)] flex-shrink-0" />
                    Message timestamps and content
                  </li>
                </ul>
                
                <h3 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-4">What we NEVER access:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <XCircle size={18} className="text-[var(--destructive)] flex-shrink-0" />
                    Your file system or other applications
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <XCircle size={18} className="text-[var(--destructive)] flex-shrink-0" />
                    API keys, passwords, or credentials
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <XCircle size={18} className="text-[var(--destructive)] flex-shrink-0" />
                    Anything you don&apos;t explicitly select
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Upload */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-10">
                <div className="w-16 h-16 mx-auto mb-5 rounded-[var(--radius-2xl)] bg-[var(--accent-subtle)] flex items-center justify-center">
                  <FileText size={28} className="text-[var(--accent-primary)]" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Upload Your Chat History</h1>
                <p className="text-[var(--text-muted)]">Choose how you want to provide your Cursor conversation.</p>
              </div>

              {/* Upload Zone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[var(--accent-primary)]', 'bg-[var(--accent-subtle)]') }}
                onDragLeave={(e) => { e.currentTarget.classList.remove('border-[var(--accent-primary)]', 'bg-[var(--accent-subtle)]') }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-[var(--accent-primary)]', 'bg-[var(--accent-subtle)]')
                  if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0])
                }}
                className="border-2 border-dashed border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-12 text-center cursor-pointer bg-[var(--bg-card)] hover:border-[var(--border-medium)] transition-all mb-6"
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".json,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
                <Upload size={40} className="mx-auto mb-4 text-[var(--text-dim)]" />
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">Drop your file here</h3>
                <p className="text-sm text-[var(--text-dim)]">or click to browse • JSON or TXT</p>
                {uploadStatus !== 'idle' && (
                  <p className={`mt-4 text-sm font-medium ${uploadStatus === 'success' ? 'text-[var(--success)]' : 'text-[var(--destructive)]'}`}>
                    {uploadMessage}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                <span className="text-sm text-[var(--text-dim)] font-medium">OR</span>
                <div className="flex-1 h-px bg-[var(--border-subtle)]" />
              </div>

              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Paste your conversation</h3>
              <textarea
                value={pasteContent}
                onChange={(e) => { setPasteContent(e.target.value); if (e.target.value.length > 50) handlePaste() }}
                placeholder="USER: How do I build a rate limiter?&#10;&#10;ASSISTANT: I'll help you build a rate limiter..."
                className="w-full h-48 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent-primary)] resize-none transition-colors"
              />
            </div>
          )}

          {/* Step 3: Select Messages */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-10">
                <div className="w-16 h-16 mx-auto mb-5 rounded-[var(--radius-2xl)] bg-[var(--accent-subtle)] flex items-center justify-center">
                  <MessageSquare size={28} className="text-[var(--accent-primary)]" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Select Messages</h1>
                <p className="text-[var(--text-muted)]">Choose which messages to include in your showcase.</p>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
                  <span className="text-sm text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] font-semibold">{conversation.selected.size}</span> of {conversation.messages.length} selected
                  </span>
                  <div className="flex gap-2">
                    <button onClick={selectAll} className="px-3 py-1.5 text-xs font-medium bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] hover:border-[var(--border-medium)] transition-colors">
                      Select All
                    </button>
                    <button onClick={deselectAll} className="px-3 py-1.5 text-xs font-medium bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] hover:border-[var(--border-medium)] transition-colors">
                      Deselect All
                    </button>
                  </div>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto">
                  {conversation.messages.map((msg, i) => (
                    <div 
                      key={i}
                      onClick={() => toggleMessageSelection(i)}
                      className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors border-b border-[var(--border-subtle)] last:border-b-0 ${
                        conversation.selected.has(i) ? 'bg-[var(--accent-subtle)]' : 'hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={conversation.selected.has(i)}
                        onChange={() => {}}
                        className="mt-1 w-4 h-4 accent-[var(--accent-primary)] rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <span className={`text-[0.625rem] font-bold uppercase tracking-wide ${
                          msg.role === 'user' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-dim)]'
                        }`}>
                          {msg.role}
                        </span>
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-1">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Redact */}
          {currentStep === 4 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-10">
                <div className="w-16 h-16 mx-auto mb-5 rounded-[var(--radius-2xl)] bg-[var(--accent-subtle)] flex items-center justify-center">
                  <Search size={28} className="text-[var(--accent-primary)]" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Review & Redact</h1>
                <p className="text-[var(--text-muted)]">Scan for sensitive info and redact anything you don&apos;t want shared.</p>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-5 mb-6">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">🤖 Auto-detect sensitive info</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">We&apos;ll scan for API keys, emails, and file paths.</p>
                <div className="flex gap-3">
                  <button onClick={autoRedact} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-sm font-medium hover:border-[var(--accent-primary)] transition-colors">
                    <Search size={16} />
                    Scan for Sensitive Data
                  </button>
                  <button onClick={clearRedactions} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <Trash2 size={16} />
                    Clear Redactions
                  </button>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] max-h-[400px] overflow-y-auto p-4">
                {conversation.messages.filter((_, i) => conversation.selected.has(i)).map((msg, i) => (
                  <div key={i} className={`p-4 rounded-[var(--radius-lg)] mb-3 last:mb-0 ${
                    msg.role === 'user' 
                      ? 'bg-[var(--accent-subtle)] border-l-2 border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-secondary)]'
                  }`}>
                    <span className={`text-[0.625rem] font-bold uppercase tracking-wide ${
                      msg.role === 'user' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-dim)]'
                    }`}>
                      {msg.role}
                    </span>
                    <p className="text-sm text-[var(--text-secondary)] mt-2 whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">
                  {Array.from(conversation.redactions.values()).reduce((sum, arr) => sum + arr.length, 0)} items redacted
                </span>
              </div>
            </div>
          )}

          {/* Step 5: Export */}
          {currentStep === 5 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-10">
                <div className="w-16 h-16 mx-auto mb-5 rounded-[var(--radius-2xl)] bg-[var(--accent-subtle)] flex items-center justify-center">
                  <Send size={28} className="text-[var(--accent-primary)]" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Export Your Showcase</h1>
                <p className="text-[var(--text-muted)]">Add details and you&apos;re ready to share!</p>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6 mb-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Showcase Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Building a SaaS Dashboard from Scratch"
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What did you build? What makes this conversation valuable?"
                      rows={3}
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent-primary)] resize-none transition-colors"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                      >
                        <option value="web">Web App</option>
                        <option value="automation">Automation</option>
                        <option value="design">Design</option>
                        <option value="content">Content</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Your Price</label>
                      <div className="flex">
                        <span className="px-4 py-3 bg-[var(--bg-elevated)] border border-r-0 border-[var(--border-subtle)] rounded-l-[var(--radius-lg)] text-[var(--text-dim)]">$</span>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          min="0"
                          max="99.99"
                          step="0.01"
                          className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-r-[var(--radius-lg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6 mb-6">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">📊 Export Summary</h3>
                <div className="flex gap-8">
                  <SummaryItem value={conversation.selected.size} label="Messages" />
                  <SummaryItem 
                    value={conversation.messages.filter((m, i) => conversation.selected.has(i) && m.role === 'user').length} 
                    label="Your Prompts" 
                  />
                  <SummaryItem 
                    value={Array.from(conversation.redactions.values()).reduce((sum, arr) => sum + arr.length, 0)} 
                    label="Redacted" 
                  />
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Export As:</h3>
                <div className="flex gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !canProceed()}
                    className="flex-1 flex flex-col items-center gap-2 py-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] hover:border-[var(--border-medium)] transition-all disabled:opacity-50"
                  >
                    <Download size={24} className="text-[var(--text-muted)]" />
                    <span className="font-medium text-[var(--text-primary)]">Download JSON</span>
                    <span className="text-xs text-[var(--text-dim)]">Save locally first</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !canProceed()}
                    className="flex-1 flex flex-col items-center gap-2 py-6 bg-[var(--accent-primary)] rounded-[var(--radius-xl)] text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                    <span className="font-semibold">Submit to Gallery</span>
                    <span className="text-xs opacity-60">Coming soon</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-8 border-t border-[var(--border-subtle)]">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            
            {currentStep < 5 && (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-primary)] rounded-[var(--radius-lg)] text-sm font-semibold text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function InfoCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-5 text-center">
      <span className="text-2xl mb-3 block">{icon}</span>
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{description}</p>
    </div>
  )
}

function SummaryItem({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-[var(--accent-primary)]">{value}</div>
      <div className="text-sm text-[var(--text-dim)]">{label}</div>
    </div>
  )
}
