---
description: PR Review and Merge Procedure
---

## Prerequisites

- GitHub CLI is installed
- A PR to review exists

## Procedure

### 1. List Open PRs

```bash
gh pr list --state open
```

// turbo

### 2. View PR Details

```bash
gh pr view [PR_NUMBER]
```

// turbo

### 3. Check PR Diff

```bash
gh pr diff [PR_NUMBER]
```

// turbo

### 4. Check CI Status

```bash
gh pr checks [PR_NUMBER]
```

// turbo

- Confirm all checks passed
- If failed, ask author to fix

### 5. Add Review Comments (Optional)

```bash
gh pr review [PR_NUMBER] --comment --body "[Comment Content]"
```

### 6. Submit Review

#### Approve

```bash
gh pr review [PR_NUMBER] --approve --body "[Approval Comment]"
```

#### Request Changes

```bash
gh pr review [PR_NUMBER] --request-changes --body "[Request Content]"
```

### 7. Merge PR

```bash
gh pr merge [PR_NUMBER] --merge
```

- `--merge`: Create merge commit
- `--squash`: Squash and merge
- `--rebase`: Rebase and merge

### 8. Update Local Branch

```bash
git fetch origin && git pull origin [current_branch]
```

// turbo

## Review Checklist

- [ ] Code is readable and properly commented
- [ ] Tests are added/updated
- [ ] Documentation is updated if necessary
- [ ] No breaking changes, or documented in CHANGELOG
- [ ] No security issues
- [ ] No negative impact on performance
