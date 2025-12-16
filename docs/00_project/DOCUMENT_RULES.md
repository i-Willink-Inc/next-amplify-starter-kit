# ドキュメント管理ルール

## 1. ドキュメント構成

### 1.1 ディレクトリ構造

```plaintext
my-monorepo/
├── docs/                        # ドキュメントルート
│   ├── 00_project/              # プロジェクト管理
│   │   ├── PROJECT_PLAN.md      # プロジェクト計画書
│   │   └── CHANGELOG.md         # 変更履歴
│   ├── 10_design/               # 設計ドキュメント
│   │   ├── architecture.md      # アーキテクチャ設計
│   │   └── database.md          # DB設計（Phase 2以降）
│   ├── 20_development/          # 開発ガイド
│   │   ├── getting-started.md   # セットアップ手順
│   │   ├── coding-standards.md  # コーディング規約
│   │   └── testing-guide.md     # テストガイド
│   ├── 30_operations/           # 運用ドキュメント
│   │   ├── deployment.md        # デプロイ手順
│   │   └── troubleshooting.md   # トラブルシューティング
│   └── 99_references/           # 参考資料
│       └── external-links.md    # 外部リンク集
├── README.md                    # プロジェクト概要（エントリポイント）
├── CONTRIBUTING.md              # コントリビューションガイド
└── LICENSE                      # ライセンス
```

### 1.2 番号体系

| 番号帯 | カテゴリ | 説明 |
| :---: | :--- | :--- |
| `00_` | プロジェクト管理 | 計画書、変更履歴、議事録 |
| `10_` | 設計 | アーキテクチャ、API設計、DB設計 |
| `20_` | 開発 | セットアップ、コーディング規約、テスト |
| `30_` | 運用 | デプロイ、監視、障害対応 |
| `99_` | 参考資料 | 外部リンク、用語集 |

---

## 2. ドキュメント作成ルール

### 2.1 ファイル命名規則

- **小文字のケバブケース** を使用: `getting-started.md`
- **日本語ファイル名は禁止**: 文字化け防止のため
- **バージョン番号は含めない**: Gitで履歴管理

### 2.2 必須メタ情報

各ドキュメントの冒頭に以下を記載:

```markdown
# ドキュメントタイトル

> **最終更新**: 2025-12-16  
> **作成者**: @username  
> **ステータス**: Draft | Review | Approved
```

### 2.3 Markdown スタイルガイド

| 項目 | ルール |
| :--- | :--- |
| 見出し | `#` の後にスペース、階層は適切に |
| リスト | `-` を使用（`*` は非推奨） |
| コードブロック | 言語指定必須 (```bash, ```typescript) |
| リンク | 相対パス推奨 (`./getting-started.md`) |
| 画像 | `docs/assets/` に配置、alt テキスト必須 |

---

## 3. ドキュメント更新フロー

### 3.1 更新タイミング

| トリガー | 更新内容 |
| :--- | :--- |
| 機能追加 | 関連するガイド・設計書を更新 |
| バグ修正 | 必要に応じてトラブルシューティングに追記 |
| 設定変更 | セットアップ手順・運用手順を更新 |
| フェーズ完了 | CHANGELOG.md に記録 |

### 3.2 レビュープロセス

1. ドキュメント変更は **Pull Request** で提出
2. コードレビューと同様に **1名以上のApprove** が必要
3. 大きな設計変更は Issue で事前議論

### 3.3 コミットメッセージ

ドキュメント変更時のコミットプレフィックス:

```
docs: READMEにセットアップ手順を追加
docs(design): アーキテクチャ図を更新
docs(fix): タイポ修正
```

---

## 4. フェーズ別ドキュメント作成計画

### Phase 1: モノレポ基盤のセットアップ
- [ ] `README.md` - プロジェクト概要
- [ ] `docs/20_development/getting-started.md` - 開発環境セットアップ

### Phase 1.5: Devcontainer 基盤構成
- [ ] `docs/20_development/devcontainer-guide.md` - Devcontainer利用ガイド

### Phase 2: Next.js アプリケーションの実装
- [ ] `docs/20_development/coding-standards.md` - コーディング規約
- [ ] `docs/10_design/architecture.md` - アーキテクチャ設計

### Phase 3: IaCによるAmplify環境構築
- [ ] `docs/10_design/infrastructure.md` - インフラ設計
- [ ] `docs/30_operations/deployment.md` - デプロイ手順

### Phase 4: CI/CDパイプラインの構築
- [ ] `docs/30_operations/ci-cd.md` - CI/CDパイプライン説明

### Phase 5: ドキュメント整備と公開
- [ ] 全ドキュメントの最終レビュー
- [ ] `CONTRIBUTING.md` - コントリビューションガイド
- [ ] `LICENSE` - ライセンスファイル

---

## 5. テンプレート

### 5.1 新規ドキュメントテンプレート

```markdown
# [ドキュメントタイトル]

> **最終更新**: YYYY-MM-DD  
> **作成者**: @username  
> **ステータス**: Draft

## 概要

[このドキュメントの目的を1-2文で説明]

## 目次

- [セクション1](#セクション1)
- [セクション2](#セクション2)

---

## セクション1

[内容]

## セクション2

[内容]

---

## 関連ドキュメント

- [関連ドキュメント名](./path-to-doc.md)
```

---

## 6. ツール連携

### 6.1 推奨ツール

| 用途 | ツール |
| :--- | :--- |
| ドキュメントプレビュー | VS Code + Markdown Preview |
| 図表作成 | Mermaid (Markdownに埋め込み) |
| スペルチェック | Code Spell Checker (VS Code拡張) |

### 6.2 Mermaid 図の活用

アーキテクチャ図やフロー図は Mermaid で記述:

```mermaid
graph LR
    A[開発者] --> B[ドキュメント作成]
    B --> C[PR作成]
    C --> D[レビュー]
    D --> E[マージ]
```

---

*このドキュメント管理ルールは、プロジェクトの成長に応じて更新されます。*
