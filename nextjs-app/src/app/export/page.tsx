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
  XCircle
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
      
      <main className="flex-1 max-w-3xl mx-auto px-6 py-8 w-full">
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all border ${
                  currentStep === step.num
                    ? 'bg-accent-primary text-white border-accent-primary'
                    : currentStep > step.num
                    ? 'bg-success text-white border-success'
                    : 'bg-bg-card border-border-subtle text-text-muted'
                }`}>
                  {currentStep > step.num ? <Check size={18} /> : step.num}
                </div>
                <span className={`text-xs mt-2 ${
                  currentStep === step.num ? 'text-accent-primary font-medium' : 'text-text-muted'
                }`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 md:w-16 h-0.5 mx-2 mb-6 ${
                  currentStep > step.num ? 'bg-success' : 'bg-border-subtle'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Security */}
        {currentStep === 1 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-accent-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-text-primary">Your Privacy Comes First</h1>
              <p className="text-text-secondary">Before we start, here&apos;s exactly what happens with your data.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-center">
                <div className="text-2xl mb-3">💻</div>
                <h3 className="font-semibold mb-2 text-text-primary">100% Client-Side</h3>
                <p className="text-sm text-text-secondary">Your chat history is processed entirely in your browser.</p>
              </div>
              <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-center">
                <div className="text-2xl mb-3">👁️</div>
                <h3 className="font-semibold mb-2 text-text-primary">Preview Before Sharing</h3>
                <p className="text-sm text-text-secondary">See exactly what will be shared and redact anything.</p>
              </div>
              <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-center">
                <div className="text-2xl mb-3">🗑️</div>
                <h3 className="font-semibold mb-2 text-text-primary">Nothing Stored</h3>
                <p className="text-sm text-text-secondary">Close this tab and everything is gone.</p>
              </div>
            </div>

            <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 mb-8">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wide mb-3">What we access:</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-3 text-sm text-text-primary">
                  <CheckCircle size={18} className="text-success flex-shrink-0" />
                  Your Cursor conversation history (the file you provide)
                </li>
                <li className="flex items-center gap-3 text-sm text-text-primary">
                  <CheckCircle size={18} className="text-success flex-shrink-0" />
                  Message timestamps and content
                </li>
              </ul>
              
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wide mb-3">What we NEVER access:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-sm text-text-primary">
                  <XCircle size={18} className="text-error flex-shrink-0" />
                  Your file system or other applications
                </li>
                <li className="flex items-center gap-3 text-sm text-text-primary">
                  <XCircle size={18} className="text-error flex-shrink-0" />
                  API keys, passwords, or credentials
                </li>
                <li className="flex items-center gap-3 text-sm text-text-primary">
                  <XCircle size={18} className="text-error flex-shrink-0" />
                  Anything you don&apos;t explicitly select
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Upload */}
        {currentStep === 2 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-accent-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-text-primary">Upload Your Chat History</h1>
              <p className="text-text-secondary">Choose how you want to provide your Cursor conversation.</p>
            </div>

            {/* Upload Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-accent-primary') }}
              onDragLeave={(e) => { e.currentTarget.classList.remove('border-accent-primary') }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('border-accent-primary')
                if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0])
              }}
              className="border-2 border-dashed border-border-subtle rounded-2xl p-12 text-center cursor-pointer bg-bg-card hover:border-accent-primary transition-colors mb-6"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".json,.txt"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
              <Upload size={40} className="mx-auto mb-4 text-text-muted" />
              <h3 className="text-lg font-medium mb-2 text-text-primary">Drop your file here</h3>
              <p className="text-sm text-text-muted">or click to browse • JSON or TXT</p>
              {uploadStatus !== 'idle' && (
                <p className={`mt-4 text-sm ${uploadStatus === 'success' ? 'text-success' : 'text-error'}`}>
                  {uploadMessage}
                </p>
              )}
            </div>

            {/* Paste Area */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border-subtle" />
              <span className="text-sm text-text-muted">OR</span>
              <div className="flex-1 h-px bg-border-subtle" />
            </div>

            <h3 className="font-medium mb-3 text-text-primary">Paste your conversation</h3>
            <textarea
              value={pasteContent}
              onChange={(e) => { setPasteContent(e.target.value); if (e.target.value.length > 50) handlePaste() }}
              placeholder="USER: How do I build a rate limiter?&#10;&#10;ASSISTANT: I'll help you build a rate limiter..."
              className="w-full h-48 p-4 bg-bg-card border border-border-subtle rounded-xl font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary resize-none"
            />
          </div>
        )}

        {/* Step 3: Select Messages */}
        {currentStep === 3 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-accent-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-text-primary">Select Messages</h1>
              <p className="text-text-secondary">Choose which messages to include in your showcase.</p>
            </div>

            <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-border-subtle">
                <span className="text-sm text-text-secondary">
                  <span className="text-accent-primary font-semibold">{conversation.selected.size}</span> of {conversation.messages.length} selected
                </span>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="px-3 py-1.5 text-xs bg-bg-card border border-border-subtle rounded-lg hover:border-border-medium transition-colors text-text-primary">
                    Select All
                  </button>
                  <button onClick={deselectAll} className="px-3 py-1.5 text-xs bg-bg-card border border-border-subtle rounded-lg hover:border-border-medium transition-colors text-text-primary">
                    Deselect All
                  </button>
                </div>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {conversation.messages.map((msg, i) => (
                  <div 
                    key={i}
                    onClick={() => toggleMessageSelection(i)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-bg-secondary transition-colors border-b border-border-subtle last:border-b-0 ${
                      conversation.selected.has(i) ? 'bg-accent-light' : ''
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={conversation.selected.has(i)}
                      onChange={() => {}}
                      className="mt-1 accent-accent-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <span className={`text-[0.65rem] font-semibold uppercase ${
                        msg.role === 'user' ? 'text-accent-primary' : 'text-text-muted'
                      }`}>
                        {msg.role}
                      </span>
                      <p className="text-sm text-text-secondary line-clamp-2">
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
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-accent-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-text-primary">Review & Redact</h1>
              <p className="text-text-secondary">Scan for sensitive info and redact anything you don&apos;t want shared.</p>
            </div>

            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 mb-6">
              <h3 className="font-medium mb-3 text-text-primary">🤖 Auto-detect sensitive info</h3>
              <p className="text-sm text-text-secondary mb-4">We&apos;ll scan for API keys, emails, and file paths.</p>
              <div className="flex gap-3">
                <button onClick={autoRedact} className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border-subtle rounded-xl text-sm hover:border-accent-primary transition-colors text-text-primary">
                  <Search size={16} />
                  Scan for Sensitive Data
                </button>
                <button onClick={clearRedactions} className="px-4 py-2 text-sm text-text-muted hover:text-text-primary transition-colors">
                  Clear Redactions
                </button>
              </div>
            </div>

            <div className="bg-bg-card border border-border-subtle rounded-2xl max-h-[400px] overflow-y-auto p-4">
              {conversation.messages.filter((_, i) => conversation.selected.has(i)).map((msg, i) => (
                <div key={i} className={`p-4 rounded-xl mb-3 last:mb-0 ${
                  msg.role === 'user' 
                    ? 'bg-accent-light border-l-[3px] border-accent-primary'
                    : 'bg-bg-secondary'
                }`}>
                  <span className={`text-[0.65rem] font-semibold uppercase ${
                    msg.role === 'user' ? 'text-accent-primary' : 'text-text-muted'
                  }`}>
                    {msg.role}
                  </span>
                  <p className="text-sm text-text-secondary mt-1 whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-bg-card border border-border-subtle rounded-xl flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {Array.from(conversation.redactions.values()).reduce((sum, arr) => sum + arr.length, 0)} items redacted
              </span>
            </div>
          </div>
        )}

        {/* Step 5: Export */}
        {currentStep === 5 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-accent-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-text-primary">Export Your Showcase</h1>
              <p className="text-text-secondary">Add details and you&apos;re ready to share!</p>
            </div>

            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text-primary">Showcase Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Building a SaaS Dashboard from Scratch"
                    className="w-full px-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-primary text-text-primary placeholder:text-text-muted"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text-primary">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What did you build? What makes this conversation valuable?"
                    rows={3}
                    className="w-full px-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-primary resize-none text-text-primary placeholder:text-text-muted"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-text-primary">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-primary text-text-primary"
                    >
                      <option value="web">Web App</option>
                      <option value="automation">Automation</option>
                      <option value="design">Design</option>
                      <option value="content">Content</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-text-primary">Your Price</label>
                    <div className="flex">
                      <span className="px-4 py-3 bg-bg-card border border-r-0 border-border-subtle rounded-l-xl text-text-muted">$</span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        min="0"
                        max="99.99"
                        step="0.01"
                        className="flex-1 px-4 py-3 bg-bg-secondary border border-border-subtle rounded-r-xl focus:outline-none focus:border-accent-primary text-text-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 mb-6">
              <h3 className="font-medium mb-4 text-text-primary">📊 Export Summary</h3>
              <div className="flex gap-8">
                <div>
                  <div className="text-2xl font-bold text-accent-primary">{conversation.selected.size}</div>
                  <div className="text-sm text-text-muted">Messages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-primary">
                    {conversation.messages.filter((m, i) => conversation.selected.has(i) && m.role === 'user').length}
                  </div>
                  <div className="text-sm text-text-muted">Your Prompts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-primary">
                    {Array.from(conversation.redactions.values()).reduce((sum, arr) => sum + arr.length, 0)}
                  </div>
                  <div className="text-sm text-text-muted">Redacted</div>
                </div>
              </div>
            </div>

            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
              <h3 className="font-medium mb-4 text-text-primary">Export As:</h3>
              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canProceed()}
                  className="flex-1 flex flex-col items-center gap-2 py-5 bg-bg-secondary border border-border-subtle rounded-xl hover:border-border-medium transition-all disabled:opacity-50 text-text-primary"
                >
                  <Download size={24} />
                  <span className="font-medium">Download JSON</span>
                  <span className="text-xs text-text-muted">Save locally first</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canProceed()}
                  className="flex-1 flex flex-col items-center gap-2 py-5 bg-accent-primary rounded-xl text-white hover:bg-accent-secondary transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                  <span className="font-medium">Submit to Gallery</span>
                  <span className="text-xs opacity-70">Coming soon</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-8 border-t border-border-subtle">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border-subtle rounded-xl text-text-secondary hover:border-border-medium hover:text-text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          
          {currentStep < 5 && (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent-primary rounded-xl text-white font-medium hover:bg-accent-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
