/**
 * InstallCommand - Copyable install/run command
 *
 * NOIR TERMINAL AESTHETIC
 * Glowing command box with phosphor accent
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
        className="p-3 min-w-[44px] min-h-[44px] rounded-md bg-white/5 hover:bg-phosphor/20 border border-transparent hover:border-phosphor/30 transition-all flex-shrink-0 flex items-center justify-center"
        aria-label={copied ? "Copied!" : "Copy to clipboard"}
      >
        {copied ? (
          <Check size={18} className="text-phosphor" />
        ) : (
          <Copy size={18} className="text-text-muted group-hover:text-phosphor transition-colors" />
        )}
      </button>
    </div>
  );
}
