---
description: コミット履歴からCHANGELOGを生成・更新する
---

## 前提条件

- gitリポジトリ内にいること
- Conventional Commitsに従ったコミットメッセージが使用されていること

## 手順

### 1. 前回リリースからのコミット履歴を取得

```bash
git log $(git describe --tags --abbrev=0 2>/dev/null || echo "HEAD~50")..HEAD --pretty=format:"%h %s" --no-merges
```

- タグがない場合は直近50コミットを表示

### 2. コミットをカテゴリ別に分類

コミットメッセージのプレフィックスに基づいて分類：

| プレフィックス | カテゴリ |
|---------------|---------|
| `feat:` | ✨ 新機能 |
| `fix:` | 🐛 バグ修正 |
| `docs:` | 📚 ドキュメント |
| `style:` | 💄 スタイル |
| `refactor:` | ♻️ リファクタリング |
| `perf:` | ⚡ パフォーマンス改善 |
| `test:` | ✅ テスト |
| `chore:` | 🔧 雑務・メンテナンス |
| `ci:` | 👷 CI/CD |

### 3. CHANGELOG.mdを更新

- 日付とバージョン番号を含むセクションを追加
- カテゴリごとに変更をリスト化
- 破壊的変更がある場合は `⚠️ BREAKING CHANGES` セクションを追加

### 4. フォーマット例

```markdown
## [X.Y.Z] - YYYY-MM-DD

### ✨ 新機能
- feat: 新機能の説明 (#PR番号)

### 🐛 バグ修正
- fix: 修正内容の説明 (#PR番号)

### ♻️ リファクタリング
- refactor: リファクタリング内容 (#PR番号)
```

### 5. 変更をコミット

```bash
git add CHANGELOG.md && git commit -m "docs: update CHANGELOG for vX.Y.Z"
```

// turbo
