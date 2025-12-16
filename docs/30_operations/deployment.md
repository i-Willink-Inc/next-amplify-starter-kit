# デプロイ手順

> **最終更新**: 2025-12-16  
> **ステータス**: Approved

## 概要

このプロジェクトでは、AWS Amplify を使用して Next.js アプリケーションをホスティングします。
デプロイ方法は **ローカルから手動** と **GitHub Actions から自動** の2パターンに対応しています。

---

## GitHub トークンの管理方法

| 方法 | 推奨度 | セキュリティ | コスト |
|------|-------|-------------|-------|
| **Secrets Manager（デフォルト）** | ⭐ 推奨 | ◎ 高い | 月額約$0.40 |
| 環境変数 | 開発用 | ○ 中程度 | 無料 |

### 切り替え方法

```bash
# デフォルト: Secrets Manager を使用（推奨）
npx cdk deploy

# コスト削減: 環境変数を使用
USE_SECRETS_MANAGER=false GITHUB_TOKEN=ghp_xxx npx cdk deploy
```

---

## デプロイフロー

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: CDKデプロイ（ローカル or GitHub Actions）               │
│          → AWS 上に Amplify サービスを作成                       │
│          → GitHub リポジトリと連携設定                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: main ブランチにマージ                                   │
│          → Amplify が変更を自動検知                              │
│          → amplify.yml に従ってビルド・デプロイ                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 事前準備

### 1. GitHub Personal Access Token (PAT) の作成

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」をクリック
3. スコープを選択:
   - `repo` (Full control of private repositories)
   - `admin:repo_hook` (Full control of repository hooks)
4. トークンをコピーして安全に保存

### 2. GitHub トークンの保存（方法を選択）

#### 方法A: Secrets Manager（推奨）

```bash
aws secretsmanager create-secret \
  --name github/amplify-token \
  --secret-string "ghp_xxxxxxxxxxxxxxxx" \
  --region ap-northeast-1
```

#### 方法B: 環境変数（コスト削減）

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
export USE_SECRETS_MANAGER=false
```

---

## パターン1: ローカルからのデプロイ

### 1.1 AWS 認証の設定

```bash
# 方法A: 環境変数
export AWS_ACCESS_KEY_ID=xxxxx
export AWS_SECRET_ACCESS_KEY=xxxxx
export AWS_DEFAULT_REGION=ap-northeast-1

# 方法B: AWS SSO（推奨）
aws sso login --profile your-profile
export AWS_PROFILE=your-profile
```

### 1.2 CDK デプロイ

```bash
cd infra

# Secrets Manager を使用（推奨）
npx cdk deploy

# または環境変数を使用（コスト削減）
USE_SECRETS_MANAGER=false GITHUB_TOKEN=ghp_xxx npx cdk deploy
```

---

## パターン2: GitHub Actions からのデプロイ

### 2.1 GitHub Secrets の設定

| Secret 名 | 値 | 用途 |
|----------|-----|------|
| `GH_PAT` | `ghp_xxxxxxxx` | GitHub PAT（USE_SECRETS_MANAGER=false 時のみ必要） |
| `AWS_ROLE_ARN` | `arn:aws:iam::xxx:role/xxx` | OIDC認証用 |

または:

| Secret 名 | 値 |
|----------|-----|
| `AWS_ACCESS_KEY_ID` | アクセスキーID |
| `AWS_SECRET_ACCESS_KEY` | シークレットキー |

### 2.2 ワークフローのトリガー

- **自動**: `infra/` または `amplify.yml` の変更が `main` にマージされた時
- **手動**: Actions → Deploy Infrastructure → Run workflow
  - `use_secrets_manager`: `true`（推奨）または `false`（コスト削減）

---

## 必要な設定一覧

### Secrets Manager 使用時（推奨）

| 設定場所 | 名前 | 説明 |
|---------|------|------|
| AWS Secrets Manager | `github/amplify-token` | GitHub PAT |
| GitHub Secrets | `AWS_ROLE_ARN` または `AWS_ACCESS_KEY_ID` | AWS認証 |

### 環境変数使用時（コスト削減）

| 設定場所 | 名前 | 説明 |
|---------|------|------|
| GitHub Secrets | `GH_PAT` | GitHub PAT |
| GitHub Secrets | `AWS_ROLE_ARN` または `AWS_ACCESS_KEY_ID` | AWS認証 |
| ローカル/CI | `USE_SECRETS_MANAGER=false` | 切り替えフラグ |

---

## トラブルシューティング

| エラー | 原因 | 解決方法 |
|-------|------|---------|
| `Secrets Manager secret not found` | シークレット未作成 | `aws secretsmanager create-secret` を実行 |
| `GitHub token is required` | `USE_SECRETS_MANAGER=false` なのに `GITHUB_TOKEN` 未設定 | 環境変数を設定 |
| `Access Denied` | IAM 権限不足 | 必要な権限を付与 |
