# cursor-habits

**Turn your Cursor chat history into personalized rules — automatically.**

Stop repeating yourself. Let your past conversations teach Cursor how you like to work.

---

## The Problem

You use Cursor daily. You've said things like this *dozens* of times:

> "Push to GitHub when you're done"
> "Don't test locally, deploy to Vercel"  
> "Always check mobile"
> "Add that key to .env"

But you never formalize these into rules because:
- You can't remember them all in the moment
- Writing rules from scratch feels arbitrary
- You don't know what you *actually* repeat vs. what you *think* you repeat

**Your chat history knows.** This tool extracts it.

---

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  Your 1000s of Cursor messages                              │
│  ↓                                                          │
│  cursor-habits analyzes patterns                            │
│  ↓                                                          │
│  Outputs rules you actually need                            │
└─────────────────────────────────────────────────────────────┘
```

**Everything runs locally. Your data never leaves your machine.**

---

## Installation

```bash
# Clone the repo
git clone https://github.com/rohunvora/prmpt-hstry.git
cd prmpt-hstry/cursor-habits

# Run it
python cursor_habits.py
```

No API keys. No accounts. No data uploaded anywhere.

---

## Usage

### Basic: Analyze all your chats

```bash
python cursor_habits.py
```

Output:
```
📊 Found 1,847 messages
🔍 Analyzing patterns...

TOP PATTERNS DETECTED:

🔥 PUSH TO GITHUB (127x)
   "Push changes to GitHub"
   "Commit and push when done"
   "Did you push to GitHub?"

🔥 SKIP LOCAL TESTING (84x)
   "Don't test locally"
   "Go straight to Vercel"
   "Test on production URL"

🔥 CHECK MOBILE (62x)
   "How does it look on mobile?"
   "Make sure it works on phone"

✅ Generated: suggested_rules.md
```

### Filter to recent patterns only

```bash
python cursor_habits.py --days 30
```

Only analyzes the last 30 days — useful for finding your *current* habits, not old ones.

### Export raw messages

```bash
python cursor_habits.py --export messages.json
```

Exports all your messages as JSON for your own analysis.

---

## Output

The tool generates a `suggested_rules.md` file:

```markdown
# Suggested Cursor Rules
Generated from 1,847 messages

## Deployment (detected 211 times)
- Push to GitHub after every meaningful change
- Don't test locally — deploy to Vercel, test on production
- Share the live URL when deployment is complete

## Code Quality (detected 89 times)  
- Always check mobile
- Comment code for external developers
- No silent error handling — log errors clearly

## Environment (detected 34 times)
- When user pastes API keys, add to .env immediately
- Check .env file first when code needs keys
```

Copy these into:
- **Cursor Settings → Rules for AI** (global)
- **`.cursor/rules/`** in your project (per-project)

---

## Privacy & Security

| Concern | How We Handle It |
|---------|------------------|
| Where does my data go? | **Nowhere.** 100% local processing. |
| What data is accessed? | Only Cursor's local SQLite database on your machine. |
| Is anything uploaded? | **No.** No network calls. No telemetry. No analytics. |
| Can I verify this? | Yes — read the source. It's ~200 lines of Python. |

Your chat history is sensitive. That's why this is a CLI tool, not a web app.

---

## Supported Platforms

| Platform | Status | Database Location |
|----------|--------|-------------------|
| macOS | ✅ | `~/Library/Application Support/Cursor/` |
| Windows | ✅ | `%APPDATA%\Cursor\` |
| Linux | ✅ | `~/.config/Cursor/` |

---

## What It Detects

The tool looks for patterns like:

| Pattern Type | Examples |
|--------------|----------|
| **Direct instructions** | "always", "never", "make sure", "don't" |
| **Corrections** | "no, I meant", "that's not right", "actually" |
| **Preferences** | "I prefer", "I like", "I want" |
| **Workflow** | "before you", "after you", "then" |
| **Repeated phrases** | Any phrase you've said 3+ times |

---

## FAQ

**Q: Will this slow down Cursor?**  
A: No. It reads a copy of the database. Cursor isn't affected.

**Q: How far back does it go?**  
A: All your chat history. Use `--days 30` to limit to recent.

**Q: What if I use multiple machines?**  
A: Run it on each machine. Chat history is local to each device.

**Q: Does this work with the new Cursor update?**  
A: Database format may change between versions. Open an issue if it breaks.

---

## Example Workflow

```bash
# 1. Run the analysis
python cursor_habits.py --days 30

# 2. Review the suggestions
cat suggested_rules.md

# 3. Copy to Cursor Settings (global rules)
#    Or copy to .cursor/rules/ (project rules)

# 4. Re-run monthly to catch new patterns
```

That's it. 5 minutes to better Cursor rules.

---

## Contributing

Found a bug? Want to improve pattern detection? PRs welcome.

```bash
# Run tests
python -m pytest tests/

# Format code  
black cursor_habits.py
```

---

## License

MIT — do whatever you want with it.

---

**Stop repeating yourself. Let your history write your rules.**

