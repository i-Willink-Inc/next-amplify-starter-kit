---
description: PRのレビューとマージ手順
---

## 前提条件

- GitHub CLIがインストールされていること
- レビュー対象のPRが存在すること

## 手順

### 1. オープン中のPRを一覧表示

```bash
gh pr list --state open
```

// turbo

### 2. PR詳細を確認

```bash
gh pr view [PR番号]
```

// turbo

### 3. PRの差分を確認

```bash
gh pr diff [PR番号]
```

// turbo

### 4. CIステータスを確認

```bash
gh pr checks [PR番号]
```

// turbo

- すべてのチェックがパスしていることを確認
- 失敗している場合は作者に修正を依頼

### 5. レビューコメントを追加（任意）

```bash
gh pr review [PR番号] --comment --body "[コメント内容]"
```

### 6. レビュー結果を送信

#### 承認する場合

```bash
gh pr review [PR番号] --approve --body "[承認コメント]"
```

#### 変更を要求する場合

```bash
gh pr review [PR番号] --request-changes --body "[修正依頼内容]"
```

### 7. PRをマージ

```bash
gh pr merge [PR番号] --merge
```

- `--merge`: マージコミットを作成
- `--squash`: コミットをスカッシュしてマージ
- `--rebase`: リベースしてマージ

### 8. ローカルブランチを更新

```bash
git fetch origin && git pull origin [現在のブランチ]
```

// turbo

## レビューチェックリスト

- [ ] コードが読みやすく、適切にコメントされているか
- [ ] テストが追加・更新されているか
- [ ] ドキュメントが必要に応じて更新されているか
- [ ] 破壊的変更がないか、またはCHANGELOGに記載されているか
- [ ] セキュリティ上の問題がないか
- [ ] パフォーマンスへの悪影響がないか
