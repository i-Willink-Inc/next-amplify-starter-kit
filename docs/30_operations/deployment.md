# デプロイ手順

> **最終更新**: 2025-12-16  
> **ステータス**: Approved

## 概要

このプロジェクトでは、AWS Amplify を使用して Next.js アプリケーションをホスティングします。
デプロイ方法は **ローカルから手動** と **GitHub Actions から自動** の2パターンに対応しています。

> **Note**: コスト削減のため、AWS Secrets Manager は使用せず、環境変数でGitHubトークンを渡す方式を採用しています。

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

## 事前準備（共通）

### GitHub Personal Access Token (PAT) の作成

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」をクリック
3. スコープを選択:
   - `repo` (Full control of private repositories)
   - `admin:repo_hook` (Full control of repository hooks)
4. トークンをコピーして安全に保存

---

## パターン1: ローカルからのデプロイ（推奨: 初回セットアップ時）

### 1.1 AWS 認証の設定

**方法A: 環境変数**
```bash
export AWS_ACCESS_KEY_ID=xxxxx
export AWS_SECRET_ACCESS_KEY=xxxxx
export AWS_DEFAULT_REGION=ap-northeast-1
```

**方法B: AWS SSO（推奨）**
```bash
aws sso login --profile your-profile
export AWS_PROFILE=your-profile
```

### 1.2 GitHub トークンの設定

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
```

### 1.3 CDK デプロイ

```bash
cd infra

# 変更内容を確認
npx cdk diff

# デプロイ実行
npx cdk deploy
```

### 1.4 出力の確認

デプロイ完了後、以下の出力が表示されます:
- `AmplifyAppId`: Amplify アプリ ID
- `AmplifyDefaultDomain`: デフォルトドメイン
- `ProductionUrl`: 本番 URL

---

## パターン2: GitHub Actions からのデプロイ

### 2.1 GitHub Secrets の設定

GitHub リポジトリ → Settings → Secrets and variables → Actions → Secrets

| Secret 名 | 値 | 説明 |
|----------|-----|------|
| `GH_PAT` | `ghp_xxxxxxxx` | GitHub Personal Access Token（必須） |

#### AWS認証（以下のいずれか）

**方式A: OIDC認証（推奨）**

| Secret 名 | 値 |
|----------|-----|
| `AWS_ROLE_ARN` | `arn:aws:iam::123456789012:role/GitHubActionsRole` |

**方式B: アクセスキー認証**

| Secret 名 | 値 |
|----------|-----|
| `AWS_ACCESS_KEY_ID` | `AKIAXXXXXXXX` |
| `AWS_SECRET_ACCESS_KEY` | `xxxxxxxx` |

### 2.2 ワークフローのトリガー

- **自動**: `infra/` または `amplify.yml` の変更が `main` にマージされた時
- **手動**: Actions → Deploy Infrastructure → Run workflow

---

## 必要な環境変数・シークレット一覧

### ローカル（パターン1）

| 環境変数 | 値の例 | 説明 |
|---------|-------|------|
| `GITHUB_TOKEN` | `ghp_xxxxxxxx` | GitHub PAT（必須） |
| `AWS_ACCESS_KEY_ID` | `AKIAXXXXXXXX` | IAM アクセスキー |
| `AWS_SECRET_ACCESS_KEY` | `xxxxxxxx` | IAM シークレットキー |
| `AWS_DEFAULT_REGION` | `ap-northeast-1` | リージョン |

### GitHub Secrets（パターン2）

| Secret 名 | 説明 |
|----------|------|
| `GH_PAT` | GitHub PAT（必須） |
| `AWS_ROLE_ARN` | OIDC用IAMロールARN |
| `AWS_ACCESS_KEY_ID` | アクセスキーID（OIDCを使わない場合） |
| `AWS_SECRET_ACCESS_KEY` | シークレットキー（OIDCを使わない場合） |

---

## Amplify 自動ビルド

CDK デプロイ後、Amplify Console が GitHub 連携により以下を自動実行:

1. `main` ブランチの変更を検知
2. `amplify.yml` に従ってビルド（Amplify側で自動読み込み）
3. Next.js SSR アプリをデプロイ

---

## トラブルシューティング

| エラー | 原因 | 解決方法 |
|-------|------|---------|
| `GitHub token is required` | GITHUB_TOKEN が設定されていない | 環境変数を設定 |
| `Access Denied` | IAM 権限不足 | AdministratorAccess を付与 |
| `pnpm not found` | Amplifyビルドでcorepack未有効 | amplify.yml を確認 |
