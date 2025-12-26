---
description: Workflow to generate unit tests
---

## Procedure

1. Identify target file
2. Create test file using Vitest
3. Place test file in the same directory as source (e.g., Button.tsx → Button.test.tsx)
4. Cover main features and edge cases
5. Verify execution with `pnpm test`

## Test Naming Convention

- Test file: `*.test.ts` or `*.test.tsx`
- describe: Feature or component name
- it/test: Describe expected behavior
