# cursorhabits

**Your chat history writes your rules.**

Stop telling Cursor the same things over and over. This CLI extracts patterns from your actual chat history and generates personalized `.cursorrules` automatically.

## Installation

```bash
pip install cursorhabits
```

## Quick Start

```bash
cursorhabits
```

That's it. The tool will:
1. Find your Cursor database (works on macOS, Windows, Linux)
2. Extract your chat messages
3. Filter out noise (file paths, errors, filler)
4. Detect repeated patterns
5. Generate copy-paste-ready rules

## Output

```
╭─────────────────────────────────────────────────────────────╮
│  cursorhabits                                               │
│  Your chat history writes your rules                        │
╰─────────────────────────────────────────────────────────────╯

✓ Found 1,847 messages
✓ Kept 423 meaningful messages (filtered 1,424 noise)
✓ Detected 8 patterns

Detected Patterns

  [1] GitHub Workflow (127 mentions)
      "Push to GitHub after every change"
      
  [2] Deployment (89 mentions)
      "Deploy to Vercel, don't test locally"
      
  [3] Mobile-First (56 mentions)
      "Always check how it looks on mobile"

✓ Rules saved to suggested_rules.md
```

## Options

```bash
# Analyze only recent messages
cursorhabits --days 30

# Skip AI synthesis (faster, less polished)
cursorhabits --no-llm

# Export raw messages for your own analysis
cursorhabits --export messages.json

# Custom output file
cursorhabits --output my-rules.md
```

## Apply Rules Directly

Skip copy-paste and apply rules directly to Cursor:

```bash
# Apply to current project (.cursor/rules/)
cursorhabits apply

# Apply to global Cursor settings
cursorhabits apply --global
```

## AI-Enhanced Rules

If you have an OpenAI API key set (`OPENAI_API_KEY` environment variable), cursorhabits will use GPT-4o-mini to synthesize your patterns into well-written, organized rules.

Without an API key, it falls back to template-based generation (still useful, just less polished).

## Privacy

- **100% local processing** - your messages never leave your machine
- Only reads Cursor's local SQLite database
- No telemetry, no analytics, no network calls (except optional OpenAI)
- [Read the source](https://github.com/rohunvora/prmpt-hstry/tree/main/cursorhabits) - it's ~500 lines of Python

## What It Detects

| Pattern | Examples |
|---------|----------|
| **Deployment** | "push to github", "deploy to vercel", "go live" |
| **Quality** | "check mobile", "verify data", "comment code" |
| **Error Handling** | "no fallbacks", "log errors", "don't swallow" |
| **Planning** | "think before", "explain approach", "plan first" |
| **Communication** | "be concise", "don't over-explain" |
| **Environment** | "add to .env", "api key", "environment variable" |

## Supported Platforms

| Platform | Database Location |
|----------|-------------------|
| macOS | `~/Library/Application Support/Cursor/` |
| Windows | `%APPDATA%\Cursor\` |
| Linux | `~/.config/Cursor/` |

## Development

```bash
# Clone and install in development mode
git clone https://github.com/rohunvora/prmpt-hstry.git
cd prmpt-hstry/cursorhabits
pip install -e ".[dev]"

# Run tests
pytest

# Format code
black src/
ruff check src/
```

## License

MIT - do whatever you want with it.

---

**Stop repeating yourself. Let your history write your rules.**

