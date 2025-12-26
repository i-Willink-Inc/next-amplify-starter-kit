---
description: Generate and update CHANGELOG from commit history
---

## Prerequisites

- Must be inside a git repository
- Commit messages must follow Conventional Commits

## Procedure

### 1. Get commit history since last release

```bash
git log $(git describe --tags --abbrev=0 2>/dev/null || echo "HEAD~50")..HEAD --pretty=format:"%h %s" --no-merges
```

- If no tags exist, show last 50 commits

### 2. Categorize commits

Categorize based on commit message prefix:

| Prefix | Category |
|--------|----------|
| `feat:` | ✨ New Features |
| `fix:` | 🐛 Bug Fixes |
| `docs:` | 📚 Documentation |
| `style:` | 💄 Styles |
| `refactor:` | ♻️ Refactoring |
| `perf:` | ⚡ Performance Improvements |
| `test:` | ✅ Tests |
| `chore:` | 🔧 Chores/Maintenance |
| `ci:` | 👷 CI/CD |

### 3. Update CHANGELOG.md

- Add section with date and version number
- List changes by category
- Add `⚠️ BREAKING CHANGES` section if there are breaking changes

### 4. Format Example

```markdown
## [X.Y.Z] - YYYY-MM-DD

### ✨ New Features
- feat: Description of new feature (#PR_NUMBER)

### 🐛 Bug Fixes
- fix: Description of fix (#PR_NUMBER)

### ♻️ Refactoring
- refactor: Description of refactoring (#PR_NUMBER)
```

### 5. Commit Changes

```bash
git add CHANGELOG.md && git commit -m "docs: update CHANGELOG for vX.Y.Z"
```

// turbo
