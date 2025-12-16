---
description: プロジェクト構造とアーキテクチャに関するルール
---

## モノレポ構成

- apps/ - アプリケーション（web, api など）
- packages/ - 共有パッケージ（tsconfig, eslint-config, ui）
- infra/ - AWS CDK インフラコード
- docs/ - ドキュメント

## 依存関係

- 共有パッケージは @repo/ スコープを使用
- 内部パッケージへの依存は pnpm workspace を使用
- 外部依存は各パッケージの package.json で管理

## 新機能の追加

- 新しいアプリは apps/ ディレクトリに作成
- 共有ロジックは packages/ に抽出
- インフラ変更は infra/ で CDK を使用
