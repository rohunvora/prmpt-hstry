/**
 * PromptCard - Displays a prompt with copy functionality
 *
 * NOIR TERMINAL AESTHETIC
 * Dark card with phosphor accents and glow effects
 */

'use client';

import { Copy, Check } from 'lucide-react';
import type { PromptData } from '@/lib/prompts-data';

interface PromptCardProps {
  prompt: PromptData;
  onCopy: () => void;
  copied: boolean;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  coding: {
    bg: 'bg-phosphor/10',
    text: 'text-phosphor',
    border: 'border-phosphor/20'
  },
  writing: {
    bg: 'bg-amber/10',
    text: 'text-amber',
    border: 'border-amber/20'
  },
  analysis: {
    bg: 'bg-electric-blue/10',
    text: 'text-electric-blue',
    border: 'border-electric-blue/20'
  },
  creative: {
    bg: 'bg-crimson/10',
    text: 'text-crimson',
    border: 'border-crimson/20'
  },
  system: {
    bg: 'bg-text-muted/10',
    text: 'text-text-secondary',
    border: 'border-text-muted/20'
  },
};

export default function PromptCard({ prompt, onCopy, copied }: PromptCardProps) {
  const colorScheme = categoryColors[prompt.category] || categoryColors.coding;

  return (
    <article
      className="card p-6 flex flex-col h-full cursor-pointer group"
      onClick={onCopy}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <span className={`inline-block px-2.5 py-1 rounded text-xs font-mono font-medium ${colorScheme.bg} ${colorScheme.text} border ${colorScheme.border} mb-3`}>
            {prompt.category}
          </span>
          <h3 className="font-display font-semibold text-lg text-text-primary leading-tight group-hover:text-phosphor transition-colors">
            {prompt.title}
          </h3>
        </div>
        <button
          className="p-3 min-w-[44px] min-h-[44px] rounded-md border border-border-subtle bg-noir-dark opacity-0 group-hover:opacity-100 transition-all hover:border-phosphor hover:text-phosphor flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          aria-label={copied ? "Copied!" : "Copy prompt"}
        >
          {copied ? (
            <Check size={16} className="text-phosphor" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>

      {/* Description */}
      <p className="text-text-secondary mb-4 flex-grow leading-relaxed">
        {prompt.description}
      </p>

      {/* Preview */}
      <div className="bg-noir-dark rounded-md p-4 overflow-hidden border border-border-subtle">
        <pre className="text-xs text-text-muted font-mono whitespace-pre-wrap break-words line-clamp-4">
          {prompt.prompt.slice(0, 200)}{prompt.prompt.length > 200 ? '...' : ''}
        </pre>
      </div>

      {/* Model tag */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-text-dim font-mono">
          {prompt.modelTag}
        </span>
        {copied && (
          <span className="text-xs text-phosphor font-mono font-medium">
            Copied!
          </span>
        )}
      </div>
    </article>
  );
}
