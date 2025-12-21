# Release Checklist

Complete checklist for releasing a new version of iterflow.

## Quick Reference

```bash
# Pre-release validation
npm test && npm run test:coverage && npm run build

# Version bump
# Edit package.json version manually

# Update CHANGELOG.md
# Add new version entry at top

# Commit changes
git add package.json CHANGELOG.md
git commit -m "chore: bump version to X.Y.Z"

# Create and push tag
git tag -a vX.Y.Z -m "Release vX.Y.Z - [Theme]"
git push origin main
git push origin vX.Y.Z

# Publish
npm publish
```

---

## Phase 1: Pre-Release Validation

### 1.1 Run Full Test Suite

```bash
npm test
```

**Expected:** All tests passing (note any intentionally skipped tests)
**Quality bar:** 900+ tests passing for stable release

### 1.2 Verify Test Coverage

```bash
npm run test:coverage
```

**Expected:** Coverage report generates successfully
**Quality bar:** 90%+ coverage for stable release

### 1.3 Run Type Checking

```bash
npm run test:types
```

**Expected:** No type errors

### 1.4 Verify Clean Build

```bash
rm -rf dist/
npm run build
```

**Expected:**
- `dist/` directory created
- Contains: `index.js`, `index.cjs`, `index.d.ts`
- Size: < 200KB

**Verification:**
```bash
ls -la dist/
du -h dist/

# Test CommonJS import
node -e "const {iter} = require('./dist/index.cjs'); console.log(iter([1,2,3]).sum());"
# Expected output: 6
```

### 1.5 Validate Examples

```bash
npm test tests/examples.test.ts
```

**Expected:** All committed examples run without errors

**Manual verification** (optional):
```bash
npx tsx examples/basic-stats.ts
npx tsx examples/moving-average.ts
npx tsx examples/fibonacci.ts
npx tsx examples/chaining.ts
```

### 1.6 Baseline Snapshot

Capture baseline metrics for reference:

```bash
npm test > /tmp/test-baseline.txt
cat /tmp/test-baseline.txt
```

---

## Phase 2: Version Update

### 2.1 Determine Version Bump

Follow [Semantic Versioning](https://semver.org/):

- **PATCH** (0.x.Y): Bug fixes, no API changes
  - Example: `0.3.0` → `0.3.1`
  - Use for: Critical bug fixes, documentation updates, internal refactoring

- **MINOR** (0.X.0): New features, backward compatible
  - Example: `0.3.0` → `0.4.0`
  - Use for: New methods, new features, enhanced functionality

- **MAJOR** (X.0.0): Breaking changes
  - Example: `0.9.0` → `1.0.0`
  - Use for: API changes, removed methods, behavior changes

### 2.2 Update package.json

**File:** `package.json` (line 3)

```json
{
  "name": "iterflow",
  "version": "0.3.0",  // ← Change this
  ...
}
```

### 2.3 Update CHANGELOG.md

Add new version entry at the top following [Keep a Changelog](https://keepachangelog.com/) format.

**Template:**

```markdown
## [0.3.0] - YYYY-MM-DD

### Added
- New features and capabilities
- New methods or operations
- New documentation or examples

### Changed
- Changes to existing functionality
- API modifications (for MAJOR versions)
- Improved implementations

### Fixed
- Bug fixes
- Performance improvements
- Resolved issues

### Removed
- Deprecated features removed (for MAJOR versions)

### Quality Metrics
- X tests passing (Y active, Z skipped)
- M examples working
- Coverage: XX%

[0.3.0]: https://github.com/mathscapes/iterflow/releases/tag/v0.3.0
```

**Example (v0.3.0):**

```markdown
## [0.3.0] - 2025-12-21

### Added
- 4 foundational examples demonstrating core features
- Examples README with learning path and usage guide
- Improved test suite organization and documentation

### Fixed
- Critical bug in `asyncIter.fromPromises()` causing infinite iteration
- Coverage reporting configuration to exclude build artifacts
- All async tests now running (70 tests, 1 intentionally skipped)

### Changed
- Re-enabled async test suite in npm test script
- Enhanced vitest coverage configuration for better CI/CD

### Quality Metrics
- 980 tests passing (979 active, 1 skipped)
- 7 benchmark suites validated
- 4 working examples with automated testing
- Coverage reporting fully functional

[0.3.0]: https://github.com/mathscapes/iterflow/releases/tag/v0.3.0
```

**Don't forget:** Add the version link reference at the bottom of CHANGELOG.md:

```markdown
[0.3.0]: https://github.com/mathscapes/iterflow/releases/tag/v0.3.0
```

---

## Phase 3: Create Release Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/) format for all commits.

### 3.1 Commit Bug Fixes (if any)

```bash
git add <fixed-files>

git commit -m "fix(<scope>): description of fix

Detailed explanation of what was fixed and why.

Impact:
- What this fixes
- What tests validate it

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Example:**

```bash
git add src/async-iter-flow.ts tests/async.test.ts

git commit -m "fix(async): resolve infinite loop in fromPromises method

Fixed critical bug where Promise.race() was called repeatedly on
already-resolved promises, causing infinite iteration.

Solution: Simplified implementation using Promise.all() to wait
for all promises, then yield results in original order.

Impact:
- Fixes 1 failing test in async.test.ts
- Enables full async test suite (70 tests)
- Resolves RangeError: Invalid array length errors

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 3.2 Commit Configuration Changes (if any)

```bash
git add vitest.config.ts .gitignore

git commit -m "fix(config): description of config changes

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 3.3 Commit Test Updates (if any)

```bash
git add tests/ package.json

git commit -m "test: description of test changes

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 3.4 Commit Documentation (if any)

```bash
git add examples/ docs/ README.md

git commit -m "docs: description of documentation changes

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 3.5 Commit Version Bump

```bash
git add package.json CHANGELOG.md

git commit -m "chore: bump version to 0.3.0

Version 0.3.0 - [Release Theme]

Quality Metrics:
- ✅ X tests passing (Y active, Z skipped)
- ✅ M examples working
- ✅ Coverage: XX%

Key Improvements:
- Brief summary of main changes
- Main features or fixes

[Optional: Additional context about the release]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Example:**

```bash
git add package.json CHANGELOG.md

git commit -m "chore: bump version to 0.3.0

Version 0.3.0 - Quality & Confidence Release

Quality Metrics:
- ✅ 980 tests passing (979 active, 1 skipped)
- ✅ 4 working examples with documentation
- ✅ Coverage reporting fully functional

Key Improvements:
- Fixed critical fromPromises bug
- Re-enabled async test suite
- Added comprehensive examples
- Fixed coverage configuration

Establishes solid foundation for v1.0.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Phase 4: Create Git Tag

### 4.1 Create Annotated Tag

```bash
git tag -a v0.3.0 -m "Release v0.3.0 - [Release Theme]

🐛 Bug Fixes:
- List critical bug fixes with brief descriptions

✅ Testing:
- Test suite status
- Benchmark validation status

📚 Documentation:
- Documentation improvements
- Examples added

[Brief summary of release goals/achievements]"
```

**Example:**

```bash
git tag -a v0.3.0 -m "Release v0.3.0 - Quality & Confidence

🐛 Bug Fixes:
- Fixed critical infinite loop in asyncIter.fromPromises()
- Fixed coverage reporting configuration

✅ Testing:
- Re-enabled full async test suite (70 tests)
- All 980 tests passing

📚 Documentation:
- Added 4 comprehensive examples
- Created examples README with learning path

This release establishes a stable foundation for v1.0."
```

### 4.2 Verify Tag

```bash
# View tag details
git tag -n20 v0.3.0

# List all tags
git tag -l

# Show tag with full message
git show v0.3.0
```

---

## Phase 5: Push to Remote

### 5.1 Push Commits

```bash
# Push to main branch
git push origin main
```

**Verify:**
```bash
git log origin/main..HEAD
# Should show no commits (meaning everything is pushed)
```

### 5.2 Push Tag

```bash
# Push single tag
git push origin v0.3.0

# OR push all tags at once
git push origin --tags
```

**Verify:**
```bash
# Check remote tags
git ls-remote --tags origin

# Should show:
# refs/tags/v0.3.0
```

---

## Phase 6: Publish to npm

### 6.1 Final Pre-Publish Verification

```bash
# Clean and rebuild
rm -rf dist/ node_modules/.vite
npm ci
npm run build

# Final test run
npm test

# Verify package contents
npm pack --dry-run
```

### 6.2 Publish to npm

```bash
# Ensure you're logged in
npm whoami
# If not logged in: npm login

# Publish to npm
npm publish
```

**Expected output:**
```
+ iterflow@0.3.0
```

### 6.3 Verify Publication

```bash
# Check published version
npm view iterflow version
# Expected: 0.3.0

# View full package info
npm view iterflow

# Test installation in clean directory
cd /tmp
mkdir test-iterflow && cd test-iterflow
npm init -y
npm install iterflow

# Test basic functionality
node -e "const {iter} = require('iterflow'); console.log(iter([1,2,3]).sum());"
# Expected output: 6

node -e "const {iter} = require('iterflow'); console.log(iter([1,2,3,4,5]).mean());"
# Expected output: 3
```

---

## Phase 7: Create GitHub Release

### 7.1 Navigate to Releases

1. Go to: https://github.com/mathscapes/iterflow/releases
2. Click "Draft a new release"

### 7.2 Configure Release

1. **Choose a tag:** Select `v0.3.0` from dropdown
2. **Release title:** `v0.3.0 - [Release Theme]`
   - Example: `v0.3.0 - Quality & Confidence`
3. **Description:** Copy content from CHANGELOG.md for this version

**Template:**

```markdown
## What's Changed

### Added
- Feature 1
- Feature 2

### Fixed
- Bug fix 1
- Bug fix 2

### Changed
- Change 1
- Change 2

## Quality Metrics
- ✅ X tests passing (Y active, Z skipped)
- ✅ M examples working

## Installation

```bash
npm install iterflow@0.3.0
```

## Full Changelog
https://github.com/mathscapes/iterflow/blob/main/CHANGELOG.md#030---2025-12-21
```

### 7.3 Publish Release

1. **Set as latest release:** ✅ Checked
2. Click **"Publish release"**

### 7.4 Verify Release

- Visit: https://github.com/mathscapes/iterflow/releases/latest
- Verify release notes are correct
- Check that assets are attached (if any)

---

## Phase 8: Post-Release Verification

### 8.1 Verify npm Package

```bash
# Latest version check
npm view iterflow version
# Expected: 0.3.0

# Complete package info
npm view iterflow

# Check dist-tags
npm view iterflow dist-tags
# Expected: { latest: '0.3.0' }
```

### 8.2 Verify GitHub Release

```bash
# Check GitHub release via API
curl https://api.github.com/repos/mathscapes/iterflow/releases/latest | jq '.tag_name'
# Expected: "v0.3.0"

# Verify git tags are visible
git ls-remote --tags origin
# Should show: refs/tags/v0.3.0
```

### 8.3 Test Fresh Installation

```bash
# In a new directory
cd /tmp
rm -rf test-iterflow
mkdir test-iterflow && cd test-iterflow

# Test npm installation
npm init -y
npm install iterflow

# Test basic usage
cat > test.js << 'EOF'
const { iter } = require('iterflow');

// Test basic operations
console.log('Sum:', iter([1,2,3,4,5]).sum());
console.log('Mean:', iter([1,2,3,4,5]).mean());
console.log('Filtered:', iter([1,2,3,4,5]).filter(x => x > 2).toArray());

// Test chaining
const result = iter([1,2,3,4,5])
  .map(x => x * 2)
  .filter(x => x > 4)
  .toArray();
console.log('Chained:', result);
EOF

node test.js
```

**Expected output:**
```
Sum: 15
Mean: 3
Filtered: [ 3, 4, 5 ]
Chained: [ 6, 8, 10 ]
```

### 8.4 Update Local Repository

```bash
# Back to project directory
cd /path/to/iterflow

# Verify remote state
git fetch origin
git status
# Should show: Your branch is up to date with 'origin/main'

# Verify tags
git tag -l
# Should show all tags including v0.3.0
```

---

## Troubleshooting

### Tag Issues

**Delete local tag:**
```bash
git tag -d v0.3.0
```

**Delete remote tag:**
```bash
git push origin :refs/tags/v0.3.0
# OR
git push --delete origin v0.3.0
```

**Re-create tag:**
```bash
git tag -a v0.3.0 -m "Release v0.3.0 - [Theme]"
git push origin v0.3.0
```

### npm Publish Issues

**Check npm authentication:**
```bash
npm whoami
# If not logged in:
npm login
```

**Check if version already exists:**
```bash
npm view iterflow versions
# Shows all published versions
```

**Unpublish version (within 72 hours only):**
```bash
# WARNING: Only use if absolutely necessary!
npm unpublish iterflow@0.3.0

# BETTER: Publish a patch version instead
# e.g., 0.3.1 with fixes
```

### Build Issues

**Clean everything:**
```bash
rm -rf node_modules/ dist/ coverage/ .vite/
npm ci
npm run build
npm test
```

### Git Issues

**Reset to remote state:**
```bash
git fetch origin
git reset --hard origin/main
```

**Undo last commit (if not pushed):**
```bash
git reset --soft HEAD~1
# Makes changes, keeps files staged

git reset HEAD~1
# Makes changes, unstages files
```

---

## Post-Release Tasks

### Monitor for Issues

- Check GitHub Issues: https://github.com/mathscapes/iterflow/issues
- Monitor npm downloads: `npm view iterflow`
- Review feedback in first 24-48 hours

### Announce Release

- Update project README badges if needed
- Share on social media (optional)
- Notify users in GitHub Discussions (for major releases)

### Plan Next Release

- Review any issues discovered post-release
- Plan next version based on roadmap
- Update project board with next milestones

---

## Quick Command Reference

```bash
# Full release flow
npm test && npm run test:coverage && npm run build
# Edit package.json and CHANGELOG.md
git add package.json CHANGELOG.md
git commit -m "chore: bump version to X.Y.Z"
git tag -a vX.Y.Z -m "Release vX.Y.Z - Theme"
git push origin main
git push origin vX.Y.Z
npm publish

# Verification
npm view iterflow version
git ls-remote --tags origin

# Rollback tag (if needed)
git tag -d vX.Y.Z
git push --delete origin vX.Y.Z
```

---

## Version History Template

Keep track of releases:

| Version | Date | Theme | Highlights |
|---------|------|-------|------------|
| 0.3.0 | 2025-12-21 | Quality & Confidence | Fixed critical bugs, 980 tests, 4 examples |
| 0.2.2 | 2025-12-15 | Initial Release | First public release |

---

**Last Updated:** 2025-12-21
**Maintainer:** iterflow team
