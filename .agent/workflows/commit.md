---
description: Conventional Commitsに従ったコミットを作成する
---

## 前提条件

- 変更がステージングされていること、またはステージングする変更があること

## 手順

### 1. 変更内容を確認

```bash
git status && git diff --stat
```

// turbo

### 2. 変更をステージング

```bash
git add [ファイルパス]
```

- 関連する変更のみをステージングする
- 異なる目的の変更は別々のコミットにする

### 3. コミットメッセージを作成

Conventional Commits形式に従う：

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### タイプ一覧

| タイプ | 説明 | 例 |
|--------|------|-----|
| `feat` | 新機能 | `feat(auth): add login feature` |
| `fix` | バグ修正 | `fix(api): resolve null pointer` |
| `docs` | ドキュメント変更 | `docs: update README` |
| `style` | コードスタイル変更（動作に影響なし） | `style: format code` |
| `refactor` | リファクタリング | `refactor(utils): simplify helper` |
| `perf` | パフォーマンス改善 | `perf(query): optimize database` |
| `test` | テスト追加・修正 | `test: add unit tests` |
| `chore` | ビルド・補助ツール変更 | `chore: update dependencies` |
| `ci` | CI設定変更 | `ci: add GitHub Actions` |

#### スコープ（任意）

変更が影響する範囲を括弧内に記載：
- `auth`, `api`, `ui`, `db`, `config` など

#### 破壊的変更

- タイプの後に `!` を追加: `feat!: breaking change`
- または、フッターに `BREAKING CHANGE:` を記載

### 4. コミットを実行

```bash
git commit -m "<type>(<scope>): <description>"
```

### 5. コミット履歴を確認

```bash
git log --oneline -5
```

// turbo

## ベストプラクティス

- descriptionは命令形で記載（"add", "fix", "update" など）
- 50文字以内に収める
- 末尾にピリオドを付けない
- 1つのコミットには1つの論理的変更のみ含める
