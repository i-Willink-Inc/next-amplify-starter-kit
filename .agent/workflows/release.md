---
description: Merge develop to main and create a release
---

## Prerequisites

- Must be on develop branch
- Changes to release are committed to develop branch
- GitHub CLI is installed

## Procedure

### 1. Push develop branch

```bash
git push origin develop
```

### 2. Create PR

```bash
gh pr create --base main --head develop --title "[Title]" --body "[Details]"
```

- Confirm PR title and details with user

### 3. Wait for CI Jobs

```bash
gh pr checks [PR_NUMBER] --watch
```

- Confirm all CI passed
- If failed, fix and push again

// turbo

### 4. Merge PR

```bash
gh pr merge [PR_NUMBER] --merge --delete-branch=false
```

// turbo

### 5. Switch to main and pull

```bash
git fetch origin main && git checkout main && git pull origin main
```

### 6. Check changes since last release

```bash
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

- Create release notes based on this log
- Confirm changes with user and decide release notes content

### 7. Determine Next Version

```bash
git tag --list | sort -V | tail -3
```

- Check latest tag and determine next version
- Follow Semantic Versioning (MAJOR.MINOR.PATCH)
  - MAJOR: Breaking changes
  - MINOR: Feature additions
  - PATCH: Bug fixes

### 8. Create Tag and Push

```bash
git tag v[X.Y.Z] && git push origin v[X.Y.Z]
```

### 9. Create GitHub Release

```bash
gh release create v[X.Y.Z] --title "v[X.Y.Z]: [Title]" --notes "[Release Notes]"
```

- Use Markdown for release notes
- Categorization (Features, Bug Fixes, Improvements, etc.) recommended

// turbo

### 10. Switch back to develop

```bash
git checkout develop
```

### 11. Completion Report

- Report Release URL, Tag, and included changes to user
