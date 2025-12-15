# Contributing to prmpt-hstry

Thank you for your interest in contributing to prmpt-hstry! This project aims to make it easy for people to track and share their AI prompt histories alongside their finished products.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version)

### Suggesting Features

We welcome feature suggestions! Please open an issue describing:
- The use case for the feature
- How it would work
- Any alternatives you've considered

### Code Contributions

1. **Fork the repository**
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test your changes**: Ensure the CLI and API work as expected
5. **Commit your changes**: Use clear commit messages
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

### Development Setup

```bash
git clone https://github.com/rohunvora/prmpt-hstry.git
cd prmpt-hstry
npm install
```

### Testing

Currently, testing is done manually. Test both:
- CLI commands (init, add, view, export, clear)
- Programmatic API (PromptHistory class methods)

Example test workflow:
```bash
# Test CLI
cd /tmp/test-dir
node /path/to/cli.js init -n "Test"
node /path/to/cli.js add -p "Test prompt" -r "Response"
node /path/to/cli.js view
node /path/to/cli.js export --markdown
```

### Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Keep functions focused and small
- Follow existing code patterns

### Areas for Contribution

Some ideas for contributions:
- Add automated tests
- Improve error handling
- Add more export formats (HTML, PDF)
- Add filtering and searching features
- Create a web UI
- Add prompt templates
- Integration with popular AI tools
- Performance optimizations

## Questions?

Feel free to open an issue with any questions!
