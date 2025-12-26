# Next.js Amplify Starter Kit

[English](README.md)

[![CI](https://github.com/i-Willink-Inc/next-amplify-starter-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/i-Willink-Inc/next-amplify-starter-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

モダンな Web 開発のベストプラクティスを集約したスターターキットです。Next.js + AWS Amplify + CDK によるモノレポ構成で、最速で Web サイトを立ち上げ、かつスケーラブルな基盤を提供します。

---

## 📋 目次

- [特徴](#-特徴)
- [プロジェクト構成](#-プロジェクト構成)
- [クイックスタート](#-クイックスタート)
- [AWS へのデプロイ](#-aws-へのデプロイ)
- [必要な環境変数・シークレット](#-必要な環境変数シークレット)
- [利用可能なコマンド](#-利用可能なコマンド)
- [ドキュメント](#-ドキュメント)

---

## ✨ 特徴

| 技術 | 説明 |
|------|------|
| 🚀 **Turborepo** | 高速なビルドキャッシュとモノレポ管理 |
| ⚡ **Next.js 15** | App Router + React 19 + SSR対応 |
| ☁️ **AWS CDK** | Infrastructure as Code で再現性を担保 |
| 📧 **AWS SES** | メール送信機能（問い合わせフォーム対応） |
| 🎨 **Tailwind CSS** | ユーティリティファーストなスタイリング |
| 🔄 **GitHub Actions** | CI/CD パイプライン完備 |
| 📦 **pnpm** | 高速で効率的なパッケージ管理 |
| 🐳 **Devcontainer** | 統一された開発環境 |

---

## 📁 プロジェクト構成

```
next-amplify-starter-kit/
├── apps/
│   └── web/                 # Next.js アプリケーション
├── packages/
│   ├── tsconfig/            # 共有 TypeScript 設定
│   └── eslint-config/       # 共有 ESLint 設定
├── infra/                   # AWS CDK インフラコード
├── docs/                    # ドキュメント
│   ├── 00_project/          # プロジェクト管理
│   ├── 20_development/      # 開発ガイド
│   └── 30_operations/       # 運用ガイド
└── .github/workflows/       # CI/CD 定義
```

---

## 🚀 クイックスタート

### 前提条件

| ツール | 最小バージョン | 推奨 |
|--------|--------------|------|
| Node.js | 18.17.0 | 20.x LTS |
| pnpm | 8.0.0 | 9.x |
| Docker | - | 最新版（Devcontainer使用時） |

### 1. リポジトリのクローン

```bash
git clone https://github.com/i-Willink-Inc/next-amplify-starter-kit.git
cd next-amplify-starter-kit
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 開発サーバーの起動

```bash
pnpm dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

### Devcontainer を使用する場合（推奨）

1. Docker Desktop または Rancher Desktop を起動
2. VS Code でプロジェクトを開く
3. コマンドパレット (Ctrl+Shift+P) → **「Dev Containers: Reopen in Container」**

> **Note**: Docker context の設定については [Devcontainer 利用ガイド](docs/20_development/devcontainer-guide.md) を参照してください。

---

## ☁️ AWS へのデプロイ

### デプロイフロー

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

### パターン1: ローカルからのデプロイ（初回セットアップ推奨）

`.env` ファイルを使用して簡単にデプロイできます。

```bash
# 1. 環境変数の設定
cp infra/.env.example infra/.env
# infra/.env を編集して AWS認証情報 と GITHUB_TOKEN を設定

# 2. CDK デプロイ
cd infra
npx cdk deploy
```

### パターン2: GitHub Actions からの自動デプロイ

1. GitHub Secrets に認証情報を設定（下記参照）
2. `infra/` 配下のファイルを変更して `main` にマージ
3. GitHub Actions が自動で CDK デプロイを実行

詳細な手順は [デプロイ手順書](docs/30_operations/deployment.md) を参照してください。

---

## 🔐 必要な環境変数・シークレット

### AWS Secrets Manager（必須）

| シークレット名 | 値 | 説明 |
|--------------|-----|------|
| `github/amplify-token` | `ghp_xxxxxxxx` | GitHub Personal Access Token |

**GitHub PAT に必要なスコープ:**
- `repo` - リポジトリへのフルアクセス
- `admin:repo_hook` - Webhook 設定用

### ローカル環境変数（パターン1使用時）

| 環境変数 | 値の例 | 説明 |
|---------|-------|------|
| `AWS_ACCESS_KEY_ID` | `AKIAXXXXXXXX` | IAM アクセスキー ID |
| `AWS_SECRET_ACCESS_KEY` | `xxxxxxxx` | IAM シークレットアクセスキー |
| `AWS_DEFAULT_REGION` | `ap-northeast-1` | デフォルトリージョン |

### GitHub Secrets（パターン2使用時）

#### 方式A: OIDC認証（推奨）

| Secret 名 | 値の例 |
|----------|-------|
| `AWS_ROLE_ARN` | `arn:aws:iam::123456789012:role/GitHubActionsRole` |

#### 方式B: アクセスキー認証

| Secret 名 | 値の例 |
|----------|-------|
| `AWS_ACCESS_KEY_ID` | `AKIAXXXXXXXX` |
| `AWS_SECRET_ACCESS_KEY` | `xxxxxxxx` |

---

## 📋 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | プロダクションビルド |
| `pnpm lint` | ESLint 実行 |
| `pnpm format` | Prettier でフォーマット |
| `pnpm test` | テスト実行 |

### CDK コマンド（infra/）

| コマンド | 説明 |
|---------|------|
| `npx cdk diff` | 変更内容を確認 |
| `npx cdk deploy` | スタックをデプロイ |
| `npx cdk synth` | CloudFormation テンプレート生成 |

---

## 📚 ドキュメント

| ドキュメント | 対象者 | 説明 |
|------------|-------|------|
| [ドキュメント管理ルール](docs/00_project/DOCUMENT_RULES.md) | 開発者 | ドキュメントの書き方 |
| [開発環境セットアップ](docs/20_development/getting-started.md) | 開発者 | 開発環境の構築手順 |
| [Devcontainer 利用ガイド](docs/20_development/devcontainer-guide.md) | 開発者 | Docker開発環境の利用方法 |
| [SES メール機能ガイド](docs/20_development/ses-email-guide.md) | 開発者 | メール送信機能の使い方 |
| [デプロイ手順書](docs/30_operations/deployment.md) | 運用者 | AWS へのデプロイ手順 |

---

## 🤝 コントリビューション

コントリビューションを歓迎します！詳細は [CONTRIBUTING.md](CONTRIBUTING.md) をご覧ください。

---

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
