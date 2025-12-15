# Quick Start Guide

Get started with `prmpt-hstry` in 60 seconds!

## 1. Clone and Setup

```bash
git clone https://github.com/rohunvora/prmpt-hstry.git
cd prmpt-hstry
npm install
```

## 2. Try it out

```bash
# Create a test directory
mkdir ~/my-ai-project
cd ~/my-ai-project

# Initialize prompt history
node /path/to/prmpt-hstry/cli.js init --name "My AI Project" --description "Learning to use AI tools"

# Add your first prompt
node /path/to/prmpt-hstry/cli.js add \
  --prompt "Create a hello world function in Python" \
  --response "def hello(): print('Hello, World!')" \
  --tags "python,basics" \
  --note "This was my first AI-assisted code"

# Add more prompts as you work
node /path/to/prmpt-hstry/cli.js add \
  --prompt "Add error handling to the function" \
  --response "Added try-except blocks" \
  --tags "python,error-handling"

# View your history
node /path/to/prmpt-hstry/cli.js view --full

# Export to share with others
node /path/to/prmpt-hstry/cli.js export --markdown --output MY-AI-JOURNEY.md
```

## 3. Share Your Learning

After building something with AI assistance:

1. Export your prompt history: `node cli.js export --markdown --output PROMPTS.md`
2. Add it to your git repo: `git add PROMPTS.md .prmpt-hstry.json`
3. Commit: `git commit -m "Add prompt history for learning"`
4. Push to GitHub: `git push`

Now others can see exactly how you used AI to build your project!

## What's Next?

- Read the [full README](README.md) for all features
- Check out the [example output](EXAMPLE.md)
- Use the programmatic API in your Node.js scripts
- Share your prompt histories to help others learn

## Tips

- **Track as you go**: Add prompts immediately while the context is fresh
- **Be descriptive**: Include enough detail to understand later
- **Use tags**: Organize prompts for easy filtering
- **Export regularly**: Share your learning journey
- **Include in version control**: Your prompt history is as valuable as your code!
