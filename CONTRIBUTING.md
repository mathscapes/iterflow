# Contributing to iterflow

Thanks for your interest in contributing!

## Quick Start

```bash
git clone https://github.com/mathscapes/iterflow.git
cd iterflow
npm install
npm test
```

## Contributing

### Bugs

Use the bug report template. Include minimal reproduction code.

### Features

Open an issue first to discuss. Must align with project principles:

- Zero runtime dependencies
- Type safety (no `any`)
- Lazy evaluation (generators)
- Explicit error handling

### Pull Requests

1. Fork and create a branch
2. Write code + tests
3. Verify: `npm test && npx tsc --noEmit && npm run build`
4. Submit PR using the template

**Requirements:**

- All tests pass
- No TypeScript errors
- Add tests for new functionality
- Follow existing code style

## What We Accept

**Encouraged:**

- Bug fixes with tests
- Performance improvements with benchmarks
- Documentation improvements

**Discuss first:**

- New features
- Breaking changes (strong rationale needed)

**Not accepted:**

- Runtime dependencies
- Breaking lazy evaluation
- Removing type safety

## Release Process

For maintainers:

1. Commit changes: `git add . && git commit -m "release version X.X.X"`
2. Publish to npm: `npm publish --tag next` (or `latest`)
3. Tag and push: `git tag vX.X.X && git push origin main --tags`
4. Create GitHub release from tag with CHANGELOG excerpt

## Questions?

Open an issue or start a discussion on GitHub.

## License

MIT - contributions will be licensed under the same terms.
