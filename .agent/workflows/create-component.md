---
description: 新しい React コンポーネントを作成するワークフロー
---

## 手順

1. コンポーネントファイルを作成（例: apps/web/src/components/Button.tsx）
2. TypeScript の型定義を含める
3. 必要に応じて Tailwind CSS でスタイリング
4. テストファイルを同じディレクトリに作成
5. エクスポートを index.ts に追加（該当する場合）

## テンプレート

```tsx
interface Props {
  // プロパティ定義
}

export function ComponentName({ ...props }: Props) {
  return (
    <div>
      {/* コンテンツ */}
    </div>
  );
}
```
