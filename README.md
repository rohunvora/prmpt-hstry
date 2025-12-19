<div align="center">
  <h1>cursorhabits</h1>
  <p><strong>Your chat history writes your rules.</strong></p>
  <p>Extract patterns from your Cursor conversations and generate personalized .cursorrules automatically.</p>
  
  <p>
    <a href="https://prmpt-hstry.vercel.app"><strong>🌐 Website</strong></a> ·
    <a href="#quick-start"><strong>⚡ Quick Start</strong></a> ·
    <a href="cursorhabits/"><strong>📁 CLI Tool</strong></a>
  </p>
</div>

---

## The Problem

You use Cursor daily. You've said things like this **dozens** of times:

> "Push to GitHub when you're done"  
> "Don't test locally, deploy to Vercel"  
> "Always check mobile"  
> "Add that key to .env"

But you never formalize these into rules because:
- You can't remember them all in the moment
- Writing rules from scratch feels arbitrary
- You don't know what you *actually* repeat vs. what you *think* you repeat

**Your chat history already knows.** This tool extracts it.

---

## Quick Start

### Option 1: pip install (recommended)

```bash
pip install cursorhabits
cursorhabits
```

### Option 2: Run from source

```bash
git clone https://github.com/rohunvora/prmpt-hstry.git
cd prmpt-hstry/cursorhabits
pip install -e .
cursorhabits
```

That's it. No API keys required, no accounts, no data uploaded anywhere.

---

## Output

```
╭───────────────────────────────────────╮
│  cursorhabits                         │
│  Your chat history writes your rules  │
╰───────────────────────────────────────╯

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

---

## What You Get

The tool generates a `suggested_rules.md` file with rules extracted from your actual habits:

```markdown
# Cursor Rules

## Deployment
- Deploy to Vercel and test on production URL, not localhost
- Push to GitHub after every meaningful change - don't wait to be asked

## Quality
- Always evaluate how changes look on mobile before considering done
- Verify all calculations - trace at least one example end-to-end
- Comment code for external developers - explain the "why"

## Environment
- When user provides API keys, add to .env immediately and confirm
```

Copy these into:
- **Cursor Settings → Rules for AI** (global)
- **`.cursor/rules/`** in your project (per-project)

Or run `cursorhabits apply` to do it automatically.

---

## Features

| Feature | Description |
|---------|-------------|
| **Smart Filtering** | Removes file paths, error logs, task IDs, and conversational filler |
| **Pattern Detection** | Finds repeated instructions across 12+ categories |
| **AI Synthesis** | Optional OpenAI integration for polished rule generation |
| **Direct Apply** | Write rules directly to Cursor settings |
| **100% Local** | Your data never leaves your machine |

---

## Privacy First

| Concern | How We Handle It |
|---------|------------------|
| Where does my data go? | **Nowhere.** 100% local processing. |
| What data is accessed? | Only Cursor's local SQLite database. |
| Is anything uploaded? | **No.** No network calls. No telemetry. |
| Can I verify this? | Yes — it's ~500 lines of Python. [Read it](cursorhabits/src/cursorhabits/). |

---

## Repository Structure

```
.
├── cursorhabits/           ← The pip-installable CLI tool
│   ├── src/cursorhabits/   ← Source code
│   ├── pyproject.toml      ← Package config
│   └── README.md           ← Detailed docs
│
├── cursor-habits/          ← Legacy standalone script
│
├── nextjs-app/             ← Landing page website
│   └── ...                 ← https://prmpt-hstry.vercel.app
│
└── README.md               ← You are here
```

---

## Links

- **Website:** [prmpt-hstry.vercel.app](https://prmpt-hstry.vercel.app)
- **CLI Tool:** [cursorhabits/](cursorhabits/)
- **Twitter:** [@rohunvora](https://twitter.com/rohunvora)

---

## License

MIT — do whatever you want with it.

---

<div align="center">
  <strong>Stop repeating yourself. Let your history write your rules.</strong>
</div>
