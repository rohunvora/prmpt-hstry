# prmpt-hstry

Easy way to share entire prompt history, tied to a finished product so people can learn.

## Overview

`prmpt-hstry` is a simple tool to track, manage, and share your AI prompt conversations. It helps you document your prompting journey alongside your finished products, making it easy for others to learn from your process.

## Features

- 📝 Track prompts and responses in your project
- 🏷️ Tag and categorize prompts
- 📤 Export as JSON or Markdown
- 🔗 Link prompt history to your finished product
- 🎓 Share your learning process with others

## Installation

```bash
npm install -g prmpt-hstry
```

Or use it locally in your project:

```bash
npm install prmpt-hstry
```

## CLI Usage

### Initialize a new prompt history

```bash
prmpt-hstry init --name "My AI Project" --description "Building a chatbot"
```

This creates a `.prmpt-hstry.json` file in your current directory.

### Add a prompt

```bash
prmpt-hstry add --prompt "How do I implement authentication?" \
  --response "You can use JWT tokens..." \
  --tags "auth,security" \
  --note "This worked great for the login feature"
```

### View your history

```bash
# List all prompts
prmpt-hstry view

# View full details
prmpt-hstry view --full

# View specific prompt
prmpt-hstry view --id 1
```

### Export your history

```bash
# Export as JSON
prmpt-hstry export

# Export as Markdown
prmpt-hstry export --markdown

# Export to specific file
prmpt-hstry export --output my-prompts.md --markdown
```

### Clear history

```bash
prmpt-hstry clear --force
```

## Programmatic Usage

You can also use `prmpt-hstry` in your Node.js code:

```javascript
const PromptHistory = require('prmpt-hstry');

const history = new PromptHistory('.prmpt-hstry.json');

// Initialize
history.init('My Project', 'Building something cool');

// Add prompts
history.addPrompt(
  'How do I handle errors?',
  'Use try-catch blocks...',
  ['error-handling', 'best-practices'],
  'This solved my debugging issues'
);

// Get prompts
const prompts = history.getPrompts();
const prompt = history.getPrompt(1);

// Export
history.exportToMarkdown('prompts.md');
history.exportToJson('prompts.json');
```

## Why Track Prompt History?

When working with AI tools like ChatGPT, Claude, or GitHub Copilot, the prompts you use are often just as valuable as the code you write. By tracking your prompt history:

1. **Learn from your process** - See what worked and what didn't
2. **Share knowledge** - Help others understand how you built something
3. **Improve prompting** - Review and refine your prompting techniques
4. **Document decisions** - Keep a record of why you made certain choices
5. **Reproduce results** - Revisit successful prompts for similar tasks

## Example Workflow

```bash
# Start a new project
mkdir my-project && cd my-project
prmpt-hstry init --name "Todo App" --description "A simple todo list app"

# As you work with AI, track your prompts
prmpt-hstry add -p "Create a React component for a todo item" \
  -r "Here's a component..." -t "react,component"

prmpt-hstry add -p "Add styling with Tailwind CSS" \
  -r "Apply these classes..." -t "css,styling"

prmpt-hstry add -p "Implement local storage" \
  -r "Use localStorage API..." -t "storage,persistence"

# When done, export for sharing
prmpt-hstry export --markdown --output PROMPTS.md

# Share PROMPTS.md alongside your code on GitHub
git add PROMPTS.md
git commit -m "Add prompt history for learning"
```

## File Format

The `.prmpt-hstry.json` file stores your history in a simple format:

```json
{
  "project": "My Project",
  "description": "Project description",
  "prompts": [
    {
      "id": 1,
      "prompt": "The prompt text",
      "response": "The response",
      "tags": ["tag1", "tag2"],
      "note": "Additional notes",
      "timestamp": "2025-12-15T12:00:00.000Z"
    }
  ],
  "createdAt": "2025-12-15T12:00:00.000Z",
  "updatedAt": "2025-12-15T12:00:00.000Z"
}
```

## Best Practices

1. **Track as you go** - Add prompts immediately while the context is fresh
2. **Be descriptive** - Include enough detail to understand the context later
3. **Use tags** - Organize prompts with relevant tags for easy filtering
4. **Add notes** - Document what worked, what didn't, and why
5. **Export regularly** - Share your learning journey with others
6. **Version control** - Include your prompt history in git (add `.prmpt-hstry.json` to your repo)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
