# Next.js Amplify Starter Kit

[![CI](https://github.com/i-Willink-Inc/next-amplify-starter-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/i-Willink-Inc/next-amplify-starter-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

モダンな Web 開発のベストプラクティスを集約したスターターキットです。Next.js + AWS Amplify + CDK によるモノレポ構成で、最速で Web サイトを立ち上げ、かつスケーラブルな基盤を提供します。

## ✨ 特徴

- **🚀 Turborepo** - 高速なビルドキャッシュとモノレポ管理
- **⚡ Next.js 15** - App Router + React 19 + SSR対応
- **☁️ AWS CDK** - Infrastructure as Code で再現性を担保
- **🎨 Tailwind CSS** - ユーティリティファーストなスタイリング
- **🔄 GitHub Actions** - CI/CD パイプライン完備
- **📦 pnpm** - 高速で効率的なパッケージ管理

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
└── .github/workflows/       # CI/CD 定義
```

## 🚀 クイックスタート

### 前提条件

- Node.js 18.17.0 以上
- pnpm 8.0.0 以上
- Docker Desktop または Rancher Desktop（Devcontainer利用時）

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/i-Willink-Inc/next-amplify-starter-kit.git
cd next-amplify-starter-kit

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

### Devcontainer を使用する場合

1. Docker Desktop または Rancher Desktop を起動
2. VS Code でプロジェクトを開く
3. コマンドパレット → **「Dev Containers: Reopen in Container」**

詳細は [Devcontainer 利用ガイド](docs/20_development/devcontainer-guide.md) を参照してください。

## 📋 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | プロダクションビルド |
| `pnpm lint` | ESLint 実行 |
| `pnpm format` | Prettier でフォーマット |
| `pnpm test` | テスト実行 |

## ☁️ AWS へのデプロイ

### 事前準備

1. AWS アカウントの準備
2. GitHub Personal Access Token を Secrets Manager に保存

```bash
aws secretsmanager create-secret \
  --name github/amplify-token \
  --secret-string "ghp_your_github_pat"
```

### CDK デプロイ

```bash
cd infra
npx cdk deploy
```

## 📚 ドキュメント

- [プロジェクト計画書](docs/00_project/PROJECT_PLAN.md)
- [ドキュメント管理ルール](docs/00_project/DOCUMENT_RULES.md)
- [Devcontainer 利用ガイド](docs/20_development/devcontainer-guide.md)

## 🤝 コントリビューション

コントリビューションを歓迎します！詳細は [CONTRIBUTING.md](CONTRIBUTING.md) をご覧ください。

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
