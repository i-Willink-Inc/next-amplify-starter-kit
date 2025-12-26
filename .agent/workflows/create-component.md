---
description: Workflow to create a new React component
---

## Procedure

1. Create component file (e.g., apps/web/src/components/Button.tsx)
2. Include TypeScript type definitions
3. Style with Tailwind CSS as needed
4. Create test file in the same directory
5. Add export to index.ts (if applicable)

## Template

```tsx
interface Props {
  // Property definitions
}

export function ComponentName({ ...props }: Props) {
  return (
    <div>
      {/* Content */}
    </div>
  );
}
```
