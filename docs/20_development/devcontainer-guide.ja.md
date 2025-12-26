# Devcontainer 利用ガイド

[English](devcontainer-guide.md)

> **最終更新**: 2025-12-16  
> **ステータス**: Approved

## 概要

本プロジェクトは VS Code Dev Containers を使用して、統一された開発環境を提供します。
Docker Desktop または Rancher Desktop のいずれかを使用できます。

---

## Docker Desktop を使用する場合

### 事前準備

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) をインストール
2. Docker Desktop を起動し、システムトレイにクジラアイコンが表示されるまで待つ

### Docker context の設定

```bash
docker context use desktop-linux
docker ps
```

### Devcontainer の起動

1. VS Code でプロジェクトを開く
2. Ctrl+Shift+P → **「Dev Containers: Reopen in Container」**

---

## Rancher Desktop を使用する場合

### 事前準備

1. [Rancher Desktop](https://rancherdesktop.io/) をインストール
2. Rancher Desktop を起動
3. **Preferences** → **Container Engine** → **`dockerd (moby)`** を選択

### Docker context の設定

```bash
docker context use default
docker ps
```

### Devcontainer の起動

1. VS Code でプロジェクトを開く
2. Ctrl+Shift+P → **「Dev Containers: Reopen in Container」**

---

## Docker Desktop と Rancher Desktop の切り替え

```bash
# 利用可能な context を確認
docker context ls

# Docker Desktop を使う場合
docker context use desktop-linux

# Rancher Desktop を使う場合
docker context use default
```

> [!IMPORTANT]
> 切り替え前に、使用しない方のアプリケーションは終了しておくことを推奨します。

---

## トラブルシューティング

### `failed to connect to the docker API`

- Docker Desktop / Rancher Desktop が起動しているか確認
- 正しい Docker context に切り替え

### `context "rancher-desktop" not found`

- `docker context use default` を使用

### コンテナ内で pnpm install が失敗

- ネットワーク接続を確認
- **「Dev Containers: Rebuild Container」** で再ビルド
