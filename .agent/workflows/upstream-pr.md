---
description: フォーク元のOSSリポジトリに新機能のPRを作成する
---

## 概要

フォークしたリポジトリで開発した機能を、フォーク元（upstream）のOSSリポジトリにPRとして提出するワークフローです。

## 前提条件

- フォーク元のリポジトリがupstreamリモートとして設定されていること
- 提出する機能が自己完結していること
- テストが通過していること

## 手順

### 1. upstreamリモートの確認・設定

```bash
# リモート一覧を確認
git remote -v

# upstreamが未設定の場合は追加
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPO.git
```

// turbo

### 2. フォーク元の最新版を取得

```bash
# upstream の最新を fetch
git fetch upstream

# 最新タグを確認
git describe --tags upstream/main --abbrev=0
```

// turbo

### 3. 差分の確認

```bash
# フォーク元からの差分コミットを表示
git log upstream/main..HEAD --oneline --no-merges

# ファイル差分のサマリを表示
git diff upstream/main --stat
```

// turbo

### 4. PR用ブランチの作成

フォーク元の最新版をベースに新しいブランチを作成：

```bash
# 機能名を含むブランチ名で作成
git checkout -b feature/[機能名] upstream/main
```

### 5. 機能のチェリーピックまたはリベース

#### 方法A: 関連コミットをチェリーピック（推奨）

特定の機能に関連するコミットのみを選択：

```bash
# 必要なコミットを特定
git log --oneline origin/main

# 関連コミットをチェリーピック
git cherry-pick <commit-hash1> <commit-hash2> ...
```

#### 方法B: インタラクティブリベース

複数コミットを整理してまとめる場合：

```bash
git rebase -i upstream/main
```

### 6. 競合の解決

競合が発生した場合：

```bash
# 競合ファイルを確認
git status

# 手動で競合を解決後
git add <resolved-files>
git cherry-pick --continue
# または
git rebase --continue
```

### 7. ビルド・テストの検証

```bash
# 依存関係のインストール
pnpm install

# ビルド検証
pnpm build

# テスト実行
pnpm test

# lint チェック
pnpm lint
```

// turbo

### 8. コミットメッセージの整理

OSS向けにコミットメッセージを整理：

- Conventional Commits形式に従う
- スコープを明確にする（例: `feat(ses): add email functionality`）
- 英語で記載（OSSの場合）
- 関連Issueがあればリファレンスを追加

```bash
# 必要に応じてコミットを修正
git commit --amend
```

### 9. フォークリポジトリにプッシュ

```bash
git push origin feature/[機能名]
```

### 10. PRの作成

GitHubでPRを作成：

```bash
# GitHub CLIを使用する場合
gh pr create --repo ORIGINAL_OWNER/ORIGINAL_REPO \
  --title "feat(scope): 機能の説明" \
  --body "## 概要
機能の説明

## 変更内容
- 変更点1
- 変更点2

## テスト
テスト方法の説明

## チェックリスト
- [ ] テストが通過している
- [ ] ドキュメントを更新した
- [ ] CHANGELOG.mdに記載した（該当する場合）"
```

または GitHub Web UI で作成。

### 11. PR作成後の対応

- CIが通過することを確認
- レビューコメントに対応
- 必要に応じてコミットを追加・修正

## チェックリスト

- [ ] upstream の最新版を取得した
- [ ] 差分を確認した
- [ ] PR用ブランチを作成した
- [ ] 関連コミットをチェリーピック/リベースした
- [ ] 競合を解決した
- [ ] ビルドが成功した
- [ ] テストが通過した
- [ ] コミットメッセージを整理した
- [ ] PRを作成した

## 注意事項

### スターターキット固有の設定を除外

PRに含めるべきでないもの：

- 環境固有の設定（`.env.local`など）
- プロジェクト固有のカスタマイズ
- フォーク固有のワークフロー（このリポジトリの `.agent/workflows` など）

### ドキュメントの更新

OSS向けのPRには以下を含める：

- 機能のドキュメント
- README への追記（該当する場合）
- 使用例やセットアップ手順

### CHANGELOG の扱い

- **フォーク先（このリポジトリ）**: フォーク元との差分を記録
- **フォーク元へのPR**: フォーク元のCHANGELOG規約に従う（通常、マージ時にメンテナが更新）
