/**
 * TerminalMockup - Styled terminal window showing CLI output
 * 
 * Warm styling that doesn't feel cold/harsh like typical terminals.
 * Shows the cursorhabits output with detected patterns.
 */

'use client';

interface TerminalLine {
  type: 'command' | 'output' | 'success' | 'muted' | 'header' | 'pattern';
  content: string;
  indent?: number;
}

interface TerminalMockupProps {
  lines?: TerminalLine[];
  title?: string;
  className?: string;
}

const defaultLines: TerminalLine[] = [
  { type: 'command', content: '$ python cursor_habits.py' },
  { type: 'muted', content: '' },
  { type: 'header', content: '🔍 Scanning Cursor chat history...' },
  { type: 'muted', content: 'Found 847 messages across 23 conversations' },
  { type: 'muted', content: '' },
  { type: 'success', content: '✓ Detected 12 recurring patterns:' },
  { type: 'muted', content: '' },
  { type: 'pattern', content: '→ "push to GitHub" appeared 127 times' },
  { type: 'pattern', content: '→ "deploy to Vercel" appeared 89 times' },
  { type: 'pattern', content: '→ "check mobile" appeared 56 times' },
  { type: 'pattern', content: '→ "add to .env" appeared 34 times' },
  { type: 'muted', content: '' },
  { type: 'output', content: '📄 Generated: suggested_rules.md' },
  { type: 'muted', content: '' },
  { type: 'success', content: 'Done! Copy these into your .cursorrules file.' },
];

export default function TerminalMockup({ 
  lines = defaultLines, 
  title = "cursorhabits",
  className = "" 
}: TerminalMockupProps) {
  return (
    <div className={`terminal overflow-hidden ${className}`}>
      {/* Terminal header with traffic lights */}
      <div className="terminal-header flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="terminal-dot red" />
          <div className="terminal-dot yellow" />
          <div className="terminal-dot green" />
        </div>
        <span className="text-terminal-muted text-sm font-mono ml-2">{title}</span>
      </div>

      {/* Terminal body */}
      <div className="terminal-body">
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={`
              ${line.indent ? `ml-${line.indent * 4}` : ''}
              ${line.type === 'command' ? 'text-terminal-green' : ''}
              ${line.type === 'success' ? 'text-terminal-green font-medium' : ''}
              ${line.type === 'output' ? 'text-terminal-yellow' : ''}
              ${line.type === 'muted' ? 'text-terminal-muted' : ''}
              ${line.type === 'header' ? 'text-terminal-coral font-medium' : ''}
              ${line.type === 'pattern' ? 'text-terminal-text' : ''}
              ${!line.content ? 'h-4' : ''}
            `}
            style={{ paddingLeft: line.indent ? `${line.indent * 16}px` : undefined }}
          >
            {line.content}
          </div>
        ))}
        
        {/* Blinking cursor */}
        <div className="mt-2 flex items-center gap-1">
          <span className="text-terminal-green">$</span>
          <span className="w-2 h-4 bg-terminal-green animate-pulse" />
        </div>
      </div>
    </div>
  );
}

