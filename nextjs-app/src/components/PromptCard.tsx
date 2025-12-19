/**
 * PromptCard - Displays a prompt with copy functionality
 * 
 * Warm aesthetic matching cursorhabits design.
 */

'use client';

import { Copy, Check } from 'lucide-react';
import type { PromptData } from '@/lib/prompts-data';

interface PromptCardProps {
  prompt: PromptData;
  onCopy: () => void;
  copied: boolean;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  coding: { bg: 'bg-accent-secondary/15', text: 'text-accent-secondary' },
  writing: { bg: 'bg-accent-primary/15', text: 'text-accent-primary' },
  analysis: { bg: 'bg-accent-tertiary/30', text: 'text-amber-700' },
  creative: { bg: 'bg-purple-100', text: 'text-purple-700' },
  system: { bg: 'bg-slate-100', text: 'text-slate-700' },
};

export default function PromptCard({ prompt, onCopy, copied }: PromptCardProps) {
  const colorScheme = categoryColors[prompt.category] || categoryColors.coding;

  return (
    <article className="card p-6 flex flex-col h-full cursor-pointer group hover:shadow-lg transition-all duration-200" onClick={onCopy}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-medium ${colorScheme.bg} ${colorScheme.text} mb-3`}>
            {prompt.category}
          </span>
          <h3 className="font-display font-semibold text-lg text-text-primary leading-tight">
            {prompt.title}
          </h3>
        </div>
        <button 
          className="p-3 min-w-[44px] min-h-[44px] rounded-lg border border-border-subtle bg-bg-primary opacity-0 group-hover:opacity-100 transition-opacity hover:border-accent-primary hover:text-accent-primary flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          aria-label={copied ? "Copied!" : "Copy prompt"}
        >
          {copied ? (
            <Check size={16} className="text-accent-secondary" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>

      {/* Description */}
      <p className="text-text-secondary mb-4 flex-grow">
        {prompt.description}
      </p>

      {/* Preview */}
      <div className="bg-bg-code rounded-lg p-4 overflow-hidden">
        <pre className="text-xs text-terminal-text font-mono whitespace-pre-wrap break-words line-clamp-4">
          {prompt.prompt.slice(0, 200)}{prompt.prompt.length > 200 ? '...' : ''}
        </pre>
      </div>

      {/* Model tag */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-text-muted font-mono">
          {prompt.modelTag}
        </span>
        {copied && (
          <span className="text-xs text-accent-secondary font-medium">
            Copied!
          </span>
        )}
      </div>
    </article>
  );
}
