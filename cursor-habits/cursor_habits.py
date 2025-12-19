#!/usr/bin/env python3
"""
cursor-habits: Turn your Cursor chat history into personalized rules.

Usage:
    python cursor_habits.py              # Analyze all messages
    python cursor_habits.py --days 30    # Last 30 days only
    python cursor_habits.py --export     # Export messages to JSON
"""

import sqlite3
import json
import os
import sys
import re
import argparse
import platform
from pathlib import Path
from datetime import datetime, timedelta
from collections import Counter


def get_cursor_db_path() -> Path:
    """Get the Cursor database path for the current platform."""
    system = platform.system()
    
    if system == "Darwin":  # macOS
        base = Path.home() / "Library" / "Application Support" / "Cursor"
    elif system == "Windows":
        base = Path(os.environ.get("APPDATA", "")) / "Cursor"
    elif system == "Linux":
        base = Path.home() / ".config" / "Cursor"
    else:
        raise RuntimeError(f"Unsupported platform: {system}")
    
    db_path = base / "User" / "globalStorage" / "state.vscdb"
    
    if not db_path.exists():
        raise FileNotFoundError(
            f"Cursor database not found at: {db_path}\n"
            f"Make sure Cursor is installed and you have chat history."
        )
    
    return db_path


def extract_messages(db_path: Path, days: int = None) -> list[dict]:
    """Extract user messages from Cursor's SQLite database."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get composer timestamps for date filtering
    composer_timestamps = {}
    if days:
        cursor.execute("SELECT key, value FROM cursorDiskKV WHERE key LIKE 'composerData:%'")
        for key, value in cursor.fetchall():
            try:
                data = json.loads(value)
                composer_id = key.replace('composerData:', '')
                created = data.get('createdAt') or data.get('lastUpdatedAt')
                if created:
                    composer_timestamps[composer_id] = created
            except:
                pass
        
        cutoff = (datetime.now() - timedelta(days=days)).timestamp() * 1000
        recent_composers = {k for k, v in composer_timestamps.items() if v > cutoff}
    else:
        recent_composers = None
    
    # Extract messages
    messages = []
    cursor.execute("SELECT key, value FROM cursorDiskKV WHERE key LIKE 'bubbleId:%'")
    
    for key, value in cursor.fetchall():
        try:
            parts = key.split(':')
            if len(parts) >= 2:
                composer_id = parts[1]
                
                # Filter by date if specified
                if recent_composers is not None and composer_id not in recent_composers:
                    continue
                
                data = json.loads(value)
                if data.get('type') == 1:  # User message
                    text = data.get('text', '') or data.get('rawText', '')
                    if text and len(text.strip()) > 10:
                        messages.append({
                            'text': text.strip(),
                            'composer_id': composer_id,
                        })
        except:
            continue
    
    conn.close()
    
    # Deduplicate
    seen = set()
    unique = []
    for m in messages:
        if m['text'] not in seen:
            seen.add(m['text'])
            unique.append(m)
    
    return unique


def is_meaningful(text: str) -> bool:
    """Filter out noise (logs, file paths, very short messages)."""
    if len(text) < 20:
        return False
    if text.count('/') > 5 or text.count('\\') > 5:
        return False
    if re.search(r'\[\d{2}:\d{2}:\d{2}', text):
        return False
    if text.count('\n') > 15:
        return False
    return True


def analyze_patterns(messages: list[dict]) -> dict:
    """Analyze messages for repeated instruction patterns."""
    texts = [m['text'] for m in messages if is_meaningful(m['text'])]
    
    pattern_definitions = [
        ("github_push", r'push.*(github|changes)|commit.*(push|github)|git.*push'),
        ("vercel_deploy", r'vercel|deploy|not local|skip.*local|test.*live|go.*live|production'),
        ("update_docs", r'update.*(readme|doc|scratchpad)|readme'),
        ("mobile_check", r'mobile|phone|responsive'),
        ("no_fallbacks", r'no.*fallback|don\'t.*fallback|silent.*error|swallow'),
        ("check_before", r'before (you|implement|build|continu)'),
        ("api_keys", r'\.env|api.?key|secret|token'),
        ("be_concise", r'concise|brief|short|less.*(text|words)'),
        ("verify_data", r'verify|double.?check|make sure.*(data|calc|math)'),
        ("comment_code", r'comment|document|explain.*(code|function)'),
    ]
    
    patterns = {}
    for name, regex in pattern_definitions:
        matches = []
        for text in texts:
            if re.search(regex, text.lower()):
                matches.append(text)
        if matches:
            patterns[name] = {
                'count': len(matches),
                'examples': matches[:5]
            }
    
    # Sort by frequency
    patterns = dict(sorted(patterns.items(), key=lambda x: -x[1]['count']))
    
    return patterns


def find_repeated_phrases(messages: list[dict], min_count: int = 3) -> list[tuple[str, int]]:
    """Find phrases that appear multiple times."""
    texts = [m['text'].lower() for m in messages if is_meaningful(m['text'])]
    
    ngram_counter = Counter()
    for text in texts:
        text = re.sub(r'[^\w\s]', ' ', text)
        words = text.split()
        
        for n in range(3, 7):
            for i in range(len(words) - n + 1):
                ngram = ' '.join(words[i:i+n])
                if len(ngram) > 15:
                    ngram_counter[ngram] += 1
    
    repeated = [(p, c) for p, c in ngram_counter.items() if c >= min_count]
    repeated.sort(key=lambda x: (-x[1], -len(x[0])))
    
    # Remove substrings
    filtered = []
    for phrase, count in repeated[:30]:
        if not any(phrase in existing for existing, _ in filtered):
            filtered.append((phrase, count))
    
    return filtered[:15]


def generate_rules(patterns: dict, phrases: list) -> str:
    """Generate suggested cursor rules from analysis."""
    
    lines = [
        "# Suggested Cursor Rules",
        f"# Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "",
    ]
    
    # Map pattern names to rule categories
    category_map = {
        'github_push': ('Deployment', 'Push to GitHub after every meaningful change'),
        'vercel_deploy': ('Deployment', 'Deploy to Vercel and test on production URL, not localhost'),
        'update_docs': ('Deployment', 'Update README with current state after changes'),
        'mobile_check': ('Quality', 'Always check mobile - evaluate responsive layout'),
        'no_fallbacks': ('Error Handling', 'No silent fallbacks - log errors clearly, then throw'),
        'check_before': ('Planning', 'Think before implementing - explain approach first'),
        'api_keys': ('Environment', 'When user pastes keys, add to .env and confirm'),
        'verify_data': ('Quality', 'Verify all calculations - trace one example end-to-end'),
        'comment_code': ('Quality', 'Comment code for external developers'),
        'be_concise': ('Communication', 'Be concise - don\'t over-explain'),
    }
    
    # Group by category
    categories = {}
    for pattern_name, data in patterns.items():
        if pattern_name in category_map:
            cat, rule = category_map[pattern_name]
            if cat not in categories:
                categories[cat] = []
            categories[cat].append({
                'rule': rule,
                'count': data['count'],
                'examples': data['examples'][:2]
            })
    
    for category, rules in categories.items():
        total = sum(r['count'] for r in rules)
        lines.append(f"## {category} (detected {total} times)")
        lines.append("")
        for r in rules:
            lines.append(f"- {r['rule']}")
        lines.append("")
    
    # Add repeated phrases section
    if phrases:
        lines.append("## Frequently Repeated Phrases")
        lines.append("")
        for phrase, count in phrases[:10]:
            lines.append(f"- ({count}x) \"{phrase}\"")
        lines.append("")
    
    return '\n'.join(lines)


def print_analysis(patterns: dict, phrases: list, message_count: int):
    """Print analysis results to console."""
    print()
    print(f"📊 Analyzed {message_count} messages")
    print()
    print("=" * 50)
    print("TOP PATTERNS DETECTED")
    print("=" * 50)
    print()
    
    # Pattern name to emoji/label
    labels = {
        'github_push': '📤 PUSH TO GITHUB',
        'vercel_deploy': '🚀 DEPLOY / VERCEL',
        'update_docs': '📝 UPDATE DOCS',
        'mobile_check': '📱 CHECK MOBILE',
        'no_fallbacks': '🛡️ NO SILENT ERRORS',
        'check_before': '🤔 THINK BEFORE ACTING',
        'api_keys': '🔑 API KEYS / ENV',
        'verify_data': '✅ VERIFY DATA',
        'comment_code': '💬 COMMENT CODE',
        'be_concise': '✂️ BE CONCISE',
    }
    
    for name, data in list(patterns.items())[:8]:
        label = labels.get(name, name.upper())
        print(f"🔥 {label} ({data['count']}x)")
        for example in data['examples'][:2]:
            clean = example.replace('\n', ' ')[:80]
            print(f"   \"{clean}...\"")
        print()
    
    if phrases:
        print("=" * 50)
        print("REPEATED PHRASES")
        print("=" * 50)
        print()
        for phrase, count in phrases[:5]:
            print(f"  ({count}x) \"{phrase}\"")
        print()


def main():
    parser = argparse.ArgumentParser(
        description='Turn your Cursor chat history into personalized rules.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python cursor_habits.py              Analyze all messages
  python cursor_habits.py --days 30    Last 30 days only  
  python cursor_habits.py --export     Export messages to JSON
        """
    )
    parser.add_argument('--days', type=int, help='Only analyze messages from last N days')
    parser.add_argument('--export', metavar='FILE', nargs='?', const='messages.json',
                        help='Export messages to JSON file')
    parser.add_argument('--output', '-o', default='suggested_rules.md',
                        help='Output file for suggested rules (default: suggested_rules.md)')
    parser.add_argument('--quiet', '-q', action='store_true',
                        help='Suppress console output')
    
    args = parser.parse_args()
    
    # Find database
    try:
        db_path = get_cursor_db_path()
    except (FileNotFoundError, RuntimeError) as e:
        print(f"❌ {e}", file=sys.stderr)
        sys.exit(1)
    
    if not args.quiet:
        print()
        print("🔍 cursor-habits")
        print(f"   Reading from: {db_path}")
        if args.days:
            print(f"   Filtering to last {args.days} days")
        print()
    
    # Extract messages
    messages = extract_messages(db_path, days=args.days)
    
    if not messages:
        print("❌ No messages found.", file=sys.stderr)
        sys.exit(1)
    
    if not args.quiet:
        print(f"✅ Found {len(messages)} messages")
    
    # Export if requested
    if args.export:
        export_path = Path(args.export)
        with open(export_path, 'w', encoding='utf-8') as f:
            json.dump({
                'exported_at': datetime.now().isoformat(),
                'message_count': len(messages),
                'messages': messages
            }, f, indent=2, ensure_ascii=False)
        print(f"📁 Exported to {export_path}")
        if not args.output:
            return
    
    # Analyze patterns
    patterns = analyze_patterns(messages)
    phrases = find_repeated_phrases(messages)
    
    # Print results
    if not args.quiet:
        print_analysis(patterns, phrases, len(messages))
    
    # Generate rules file
    rules = generate_rules(patterns, phrases)
    output_path = Path(args.output)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(rules)
    
    print(f"✅ Generated: {output_path}")
    print()
    print("Next steps:")
    print("  1. Review suggested_rules.md")
    print("  2. Copy rules to Cursor Settings → Rules for AI")
    print("  3. Or add to .cursor/rules/ in your project")
    print()


if __name__ == '__main__':
    main()

