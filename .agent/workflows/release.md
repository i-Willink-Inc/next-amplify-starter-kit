---
description: developブランチをmainにマージしてリリースを作成する
---

## 前提条件

- developブランチにいること
- リリースしたい変更がdevelopブランチにコミット済みであること
- GitHub CLIがインストールされていること

## 手順

### 1. developブランチをpush

```bash
git push origin develop
```

### 2. PRを作成

```bash
gh pr create --base main --head develop --title "[タイトル]" --body "[詳細]"
```

- ユーザーにPRタイトルと詳細を確認する

### 3. CIジョブの完了を待つ

```bash
gh pr checks [PR番号] --watch
```

- CIが全て成功することを確認する
- 失敗した場合は修正を行い、再度pushする

// turbo

### 4. PRをマージ

```bash
gh pr merge [PR番号] --merge --delete-branch=false
```

// turbo

### 5. mainブランチに切り替えてpull

```bash
git fetch origin main && git checkout main && git pull origin main
```

### 6. 前回リリースからの変更を確認

```bash
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

- このログを元にリリースノートを作成する
- ユーザーに変更内容を確認し、リリースノートの内容を決定する

### 7. 新しいバージョン番号を決定

```bash
git tag --list | sort -V | tail -3
```

- 最新のタグを確認し、次のバージョン番号を決定する
- セマンティックバージョニングに従う (MAJOR.MINOR.PATCH)
  - MAJOR: 破壊的変更
  - MINOR: 機能追加
  - PATCH: バグ修正

### 8. タグを作成してpush

```bash
git tag v[X.Y.Z] && git push origin v[X.Y.Z]
```

### 9. GitHubリリースを作成

```bash
gh release create v[X.Y.Z] --title "v[X.Y.Z]: [タイトル]" --notes "[リリースノート]"
```

- リリースノートには手順6で確認した変更内容を Markdown形式で記載する
- カテゴリ分け（機能追加、バグ修正、改善など）推奨

// turbo

### 10. developブランチに戻る

```bash
git checkout develop
```

### 11. 完了報告

- リリースURL、タグ、含まれる変更をユーザーに報告する
