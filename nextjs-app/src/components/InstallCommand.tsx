/**
 * InstallCommand - Copyable install/run command
 * 
 * Clean code box with copy button.
 */

'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface InstallCommandProps {
  command: string;
  prefix?: string;
  className?: string;
}

export default function InstallCommand({ 
  command, 
  prefix = "$",
  className = "" 
}: InstallCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`install-command group ${className}`}>
      <code className="flex items-center gap-3 text-sm sm:text-base">
        <span className="prefix">{prefix}</span>
        <span className="command">{command}</span>
      </code>
      <button 
        onClick={handleCopy}
        className="p-3 min-w-[44px] min-h-[44px] rounded-md bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0 flex items-center justify-center"
        aria-label={copied ? "Copied!" : "Copy to clipboard"}
      >
        {copied ? (
          <Check size={18} className="text-terminal-green" />
        ) : (
          <Copy size={18} className="text-terminal-muted group-hover:text-terminal-text transition-colors" />
        )}
      </button>
    </div>
  );
}

