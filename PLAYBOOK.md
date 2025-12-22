# iterflow Playbook

Development and release guidelines for iterflow.

---

## Branching Strategy

We use a simple main+develop branching model until v1.0:

### Branches

- **main**: Stable releases only (tagged: v0.3.2, v0.4.0, etc.)
- **develop**: Active development (default branch for PRs)
- **feature/\***: Feature branches (created from develop, PR to develop)
- **fix/\***: Bug fix branches (created from develop, PR to develop)

### No Release Branches Until 1.0

All development happens on `develop`. When releasing, merge `develop` to `main`.

At v1.0, we will decide if we need release branches for maintenance.

---

## Contributing

### Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Run tests to verify setup: `npm test`

### Workflow

1. Create a feature branch from `develop`:

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Work on your changes:
   - Follow existing code patterns
   - Write tests for new functionality
   - Update JSDoc comments
   - Use conventional commit messages

3. Push and create a PR to `develop`:

   ```bash
   git add .
   git commit -m "feat(scope): description"
   git push origin feature/your-feature-name
   ```

4. Create PR on GitHub (target: `develop`)

5. Address review feedback

6. After merge, delete your branch

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `test`: Test changes
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `chore`: Maintenance

Scopes (optional):

- `core`: Core iterator operations
- `async`: Async iterator operations
- `stats`: Statistical operations

Examples:

```bash
git commit -m "feat(core): add groupBy operation"
git commit -m "fix(async): resolve race condition"
git commit -m "docs(readme): add performance section"
```

### Testing

- Run tests: `npm test`
- Check coverage: `npm run coverage`
- Run linting: `npm run lint`
- Build: `npm run build`
- Type check: `npm run test:types`

Maintain >90% test coverage for new code.

---

## Release Process

### Before Release

1. Ensure `develop` is ready:

   ```bash
   git checkout develop
   git pull origin develop
   npm test
   npm run build
   ```

2. Decide release type:
   - `npm version patch` (bug fixes: 0.3.2 → 0.3.3)
   - `npm version minor` (new features: 0.3.2 → 0.4.0)
   - `npm version major` (breaking changes: 0.4.0 → 1.0.0)

### Release Steps

1. **Merge develop to main**:

   ```bash
   git checkout main
   git pull origin main
   git merge develop --no-ff -m "chore: release v0.4.0"
   ```

2. **Tag and bump version**:

   ```bash
   npm version minor
   # This updates package.json, creates a commit, and tags the release
   ```

3. **Push tags**:

   ```bash
   git push origin main --tags
   ```

4. **Publish to npm**:

   ```bash
   npm publish
   ```

5. **Sync version back to develop**:

   ```bash
   git checkout develop
   git merge main --no-ff -m "chore: sync version from release"
   git push origin develop
   ```

### Announce Release

Share on X/Twitter:

```
Release iterflow [VERSION] - [HIGHLIGHTS]. https://npmjs.com/package/iterflow/v/[VERSION]
```
