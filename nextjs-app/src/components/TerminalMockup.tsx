/**
 * TerminalMockup - Styled terminal window showing CLI output
 *
 * NOIR TERMINAL AESTHETIC
 * CRT-inspired with phosphor green accents and scanline effects
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
  { type: 'header', content: 'Scanning Cursor chat history...' },
  { type: 'muted', content: 'Found 847 messages across 23 conversations' },
  { type: 'muted', content: '' },
  { type: 'success', content: 'Detected 12 recurring patterns:' },
  { type: 'muted', content: '' },
  { type: 'pattern', content: '  "push to GitHub" .............. 127x' },
  { type: 'pattern', content: '  "deploy to Vercel" ............ 89x' },
  { type: 'pattern', content: '  "check mobile" ................ 56x' },
  { type: 'pattern', content: '  "add to .env" ................. 34x' },
  { type: 'muted', content: '' },
  { type: 'output', content: 'Generated: suggested_rules.md' },
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
        <span className="text-text-muted text-sm font-mono ml-2">{title}</span>
      </div>

      {/* Terminal body */}
      <div className="terminal-body">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`
              ${line.type === 'command' ? 'text-phosphor font-medium' : ''}
              ${line.type === 'success' ? 'text-phosphor' : ''}
              ${line.type === 'output' ? 'text-amber' : ''}
              ${line.type === 'muted' ? 'text-text-dim' : ''}
              ${line.type === 'header' ? 'text-electric-blue font-medium' : ''}
              ${line.type === 'pattern' ? 'text-text-secondary' : ''}
              ${!line.content ? 'h-4' : ''}
            `}
            style={{ paddingLeft: line.indent ? `${line.indent * 16}px` : undefined }}
          >
            {line.content}
          </div>
        ))}

        {/* Blinking cursor */}
        <div className="mt-3 flex items-center gap-1">
          <span className="text-phosphor">$</span>
          <span className="w-2 h-5 bg-phosphor animate-pulse" />
        </div>
      </div>
    </div>
  );
}
