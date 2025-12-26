---
description: Create PR for a new feature to the upstream OSS repository
---

## Overview

Workflow to submit features developed in a forked repository as a PR to the original (upstream) OSS repository.

## Prerequisites

- Original repository must be set as upstream remote
- Feature must be self-contained
- Tests must pass

## Procedure

### 1. Check/Set upstream remote

```bash
# Check remotes
git remote -v

# Add upstream if not set
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPO.git
```

// turbo

### 2. Get latest from fork source

```bash
# Fetch latest from upstream
git fetch upstream

# Check latest tag
git describe --tags upstream/main --abbrev=0
```

// turbo

### 3. Check differences

```bash
# Show commit diffs from upstream
git log upstream/main..HEAD --oneline --no-merges

# Show file diff summary
git diff upstream/main --stat
```

// turbo

### 4. Create Branch for PR

Create a new branch based on upstream's latest:

```bash
# Create with feature name
git checkout -b feature/[feature_name] upstream/main
```

### 5. Cherry-pick or Rebase feature

#### Method A: Cherry-pick related commits (Recommended)

Select only commits related to the feature:

```bash
# Identify necessary commits
git log --oneline origin/main

# Cherry-pick related commits
git cherry-pick <commit-hash1> <commit-hash2> ...
```

#### Method B: Interactive Rebase

To organize multiple commits:

```bash
git rebase -i upstream/main
```

### 6. Resolve Conflicts

If conflicts occur:

```bash
# Check conflicting files
git status

# After resolving manually
git add <resolved-files>
git cherry-pick --continue
# or
git rebase --continue
```

### 7. Verify Build/Test

```bash
# Install dependencies
pnpm install

# Verify build
pnpm build

# Run tests
pnpm test

# Lint check
pnpm lint
```

// turbo

### 8. Organize Commit Messages

Organize messages for OSS:

- Follow Conventional Commits format
- Clarify scope (e.g., `feat(ses): add email functionality`)
- Write in English (for OSS)
- Add references if related Issues exist

```bash
# Amend commit if necessary
git commit --amend
```

### 9. Push to Fork Repository

```bash
git push origin feature/[feature_name]
```

### 10. Create PR

Create PR on GitHub:

```bash
# Using GitHub CLI
gh pr create --repo ORIGINAL_OWNER/ORIGINAL_REPO \
  --title "feat(scope): Feature Description" \
  --body "## Overview
Feature Description

## Changes
- Change 1
- Change 2

## Testing
Description of testing method

## Checklist
- [ ] Tests passed
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if applicable)"
```

Or create via GitHub Web UI.

### 11. Post-Creation Actions

- Ensure CI passes
- Address review comments
- Add/Fix commits as necessary

## Checklist

- [ ] Fetched latest upstream
- [ ] Checked differences
- [ ] Created PR branch
- [ ] Cherry-picked/Rebased related commits
- [ ] Resolved conflicts
- [ ] Build succeeded
- [ ] Tests passed
- [ ] Organized commit messages
- [ ] Created PR

## Notes

### Exclude Starter Kit Specific Settings

Do not include in PR:

- Environment specific settings (`.env.local`, etc.)
- Project specific customizations
- Fork specific workflows (e.g., `.agent/workflows` in this repo)

### Documentation Update

Include in OSS PR:

- Feature documentation
- Additions to README (if applicable)
- Usage examples or setup instructions

### CHANGELOG Handling

- **Fork (This Repo)**: Record diffs from upstream
- **PR to Upstream**: Follow upstream's CHANGELOG rules (usually maintained by maintainers on merge)
