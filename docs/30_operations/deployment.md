# デプロイ手順

> **最終更新**: 2025-12-16  
> **ステータス**: Approved

## 概要

このプロジェクトでは、AWS Amplify を使用して Next.js アプリケーションをホスティングします。
デプロイ方法は **ローカルから手動** と **GitHub Actions から自動** の2パターンに対応しています。

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

### 1. GitHub Personal Access Token (PAT) の作成

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」をクリック
3. スコープを選択:
   - `repo` (Full control of private repositories)
   - `admin:repo_hook` (Full control of repository hooks)
4. トークンをコピーして保存

### 2. AWS Secrets Manager に PAT を保存

```bash
aws secretsmanager create-secret \
  --name github/amplify-token \
  --secret-string "ghp_xxxxxxxxxxxxxxxx" \
  --region ap-northeast-1
```

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

**方法C: AWS CLIプロファイル**
```bash
aws configure --profile your-profile
export AWS_PROFILE=your-profile
```

### 1.2 CDK デプロイ

```bash
cd infra

# 変更内容を確認
npx cdk diff

# デプロイ実行
npx cdk deploy
```

### 1.3 出力の確認

デプロイ完了後、以下の出力が表示されます:
- `AmplifyAppId`: Amplify アプリ ID
- `AmplifyDefaultDomain`: デフォルトドメイン
- `ProductionUrl`: 本番 URL

---

## パターン2: GitHub Actions からのデプロイ

### 2.1 認証方法の選択

| 方法 | セキュリティ | 設定の手間 |
|------|-------------|-----------|
| OIDC | ◎ 高い | △ やや複雑 |
| アクセスキー | ○ 中程度 | ◎ 簡単 |

### 2.2 方法A: OIDC 認証（推奨）

#### Step 1: AWS IAM に OIDC プロバイダーを追加

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

#### Step 2: IAM ロールを作成

信頼ポリシー (`trust-policy.json`):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/YOUR_REPO:*"
        }
      }
    }
  ]
}
```

```bash
aws iam create-role \
  --role-name GitHubActionsRole \
  --assume-role-policy-document file://trust-policy.json

aws iam attach-role-policy \
  --role-name GitHubActionsRole \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

#### Step 3: GitHub Secrets を設定

| Secret 名 | 値 |
|----------|-----|
| `AWS_ROLE_ARN` | `arn:aws:iam::ACCOUNT_ID:role/GitHubActionsRole` |

### 2.3 方法B: アクセスキー認証

#### Step 1: IAM ユーザーを作成

```bash
aws iam create-user --user-name github-actions-deployer
aws iam attach-user-policy \
  --user-name github-actions-deployer \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
aws iam create-access-key --user-name github-actions-deployer
```

#### Step 2: GitHub Secrets を設定

| Secret 名 | 値 |
|----------|-----|
| `AWS_ACCESS_KEY_ID` | アクセスキーID |
| `AWS_SECRET_ACCESS_KEY` | シークレットアクセスキー |

### 2.4 GitHub Variables を設定（オプション）

認証方法を明示的に指定する場合:

| Variable 名 | 値 |
|------------|-----|
| `AUTH_METHOD` | `OIDC` または `ACCESS_KEY` |

### 2.5 ワークフローのトリガー

- **自動**: `infra/` 配下のファイル変更が `main` にマージされた時
- **手動**: Actions → Deploy Infrastructure → Run workflow

---

## Amplify 自動ビルド

CDK デプロイ後、Amplify Console が GitHub 連携により以下を自動実行:

1. `main` ブランチの変更を検知
2. `amplify.yml` に従ってビルド
3. Next.js SSR アプリをデプロイ

### ビルド設定

`amplify.yml`:
```yaml
version: 1
applications:
  - appRoot: apps/web
    frontend:
      phases:
        preBuild:
          commands:
            - corepack enable
            - corepack prepare pnpm@latest --activate
            - pnpm install --frozen-lockfile
        build:
          commands:
            - pnpm build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
```

---

## トラブルシューティング

### CDK デプロイ時のエラー

| エラー | 原因 | 解決方法 |
|-------|------|---------|
| `Secrets Manager secret not found` | GitHub PAT が保存されていない | 事前準備の手順を確認 |
| `Access Denied` | IAM 権限不足 | AdministratorAccess を付与 |

### Amplify ビルド時のエラー

| エラー | 原因 | 解決方法 |
|-------|------|---------|
| `pnpm not found` | corepack が有効化されていない | amplify.yml を確認 |
| `Module not found` | 依存関係のインストール失敗 | キャッシュをクリアして再ビルド |
