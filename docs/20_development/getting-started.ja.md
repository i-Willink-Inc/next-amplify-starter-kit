# 開発環境セットアップ

[English](getting-started.md)

> **最終更新**: 2025-12-16  
> **ステータス**: Approved

## 概要

このガイドでは、Next.js Amplify Starter Kit の開発環境をセットアップする手順を説明します。

## 前提条件

| ツール | 最小バージョン | 推奨 |
|--------|--------------|------|
| Node.js | 18.17.0 | 20.x LTS |
| pnpm | 8.0.0 | 9.x |
| Git | 2.30.0 | 最新版 |

## セットアップ手順

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

## ビルド

```bash
pnpm build
```

## コード品質チェック

```bash
# Lint
pnpm lint

# フォーマット
pnpm format
```

## Devcontainer（オプション）

Docker を使用して統一された開発環境を利用できます。

1. Docker Desktop または Rancher Desktop を起動
2. VS Code でプロジェクトを開く
3. コマンドパレット (Ctrl+Shift+P) → **「Dev Containers: Reopen in Container」**

詳細は [devcontainer-guide.md](./devcontainer-guide.md) を参照してください。

## インフラストラクチャ (AWS CDK)

このプロジェクトは AWS CDK を使用してインフラを管理しています。
`infra/` ディレクトリに CDK のコードが含まれています。

AWS へのデプロイやインフラ構成については、以下を参照してください：
- [デプロイ手順書](../30_operations/deployment.md)
- [README.md - AWS へのデプロイ](../../README.md#aws-へのデプロイ)

## 次のステップ

- [ドキュメント管理ルール](../00_project/DOCUMENT_RULES.md)
