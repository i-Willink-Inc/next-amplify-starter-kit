---
description: Create a commit following Conventional Commits
---

## Prerequisites

- Changes are staged, or there are changes to stage

## Procedure

### 1. Check Changes

```bash
git status && git diff --stat
```

// turbo

### 2. Stage Changes

```bash
git add [file_path]
```

- Stage only related changes
- Separate commits for changes with different purposes

### 3. Create Commit Message

Follow Conventional Commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add login feature` |
| `fix` | Bug fix | `fix(api): resolve null pointer` |
| `docs` | Documentation change | `docs: update README` |
| `style` | Code style change (formatting, etc.) | `style: format code` |
| `refactor` | Refactoring (no functional change) | `refactor(utils): simplify helper` |
| `perf` | Performance improvement | `perf(query): optimize database` |
| `test` | Adding/fixing tests | `test: add unit tests` |
| `chore` | Build/Auxiliary tool change | `chore: update dependencies` |
| `ci` | CI config change | `ci: add GitHub Actions` |

#### Scope (Optional)

Specify scope in parentheses:
- `auth`, `api`, `ui`, `db`, `config`, etc.

#### Breaking Change

- Add `!` after type: `feat!: breaking change`
- Or add `BREAKING CHANGE:` in footer

### 4. Execute Commit

```bash
git commit -m "<type>(<scope>): <description>"
```

### 5. Verify Commit History

```bash
git log --oneline -5
```

// turbo

## Best Practices

- Use imperative mood for description ("add", "fix", "update", etc.)
- Keep it under 50 characters
- Do not end with a period
- Include only one logical change per commit
