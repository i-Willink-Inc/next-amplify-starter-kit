# 検証ガイド

[English](verification-guide.md)

このガイドでは、プロジェクトをフォークした環境で、実装されたすべてのデプロイパターンを検証する手順を説明します。

## 📋 前提条件

1. **リポジトリのフォーク**
   - GitHub 上で `next-amplify-starter-kit` を自分のアカウントにフォークします。
   - ローカルにクローンします:
     ```bash
     git clone https://github.com/YOUR_USER/next-amplify-starter-kit.git
     cd next-amplify-starter-kit
     ```

2. **AWS 認証情報**
   - 検証用の AWS アカウントを用意してください。
   - 必要な権限: `AdministratorAccess` (推奨)

3. **GitHub Token**
   - `repo`, `admin:repo_hook` スコープを持つ PAT を取得してください。

---

## ✅ シナリオ1: ローカルデプロイ（環境変数モード）
**目的**: 最も手軽に、コストをかけずにデプロイできることを確認する。

1. **`.env` ファイルの作成**
   ```bash
   cp infra/.env.example infra/.env
   ```
2. **`.env` の編集**
   ```properties
   # infra/.env
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   GITHUB_TOKEN=ghp_...
   USE_SECRETS_MANAGER=false  # 重要
   ```
3. **デプロイ実行**
   ```bash
   cd infra
   npx cdk deploy -c repositoryOwner=YOUR_USER -c repositoryName=next-amplify-starter-kit
   ```
   > **Note**: フォークしたリポジトリ名を `-c` オプションまたは `.env` で指定してください。

4. **確認**
   - CloudFormation スタックが作成されること。
   - Amplify コンソールでアプリが作成され、ビルドが開始されること。

---

## ✅ シナリオ2: ローカルデプロイ（Secrets Managerモード）
**目的**: 本番推奨構成（Secrets Manager利用）を確認する。

1. **Secrets Manager への保存**
   ```bash
   aws secretsmanager create-secret \
     --name github/amplify-token \
     --secret-string "ghp_xxxxxxxx"
   ```
2. **`.env` の編集**
   ```properties
   # infra/.env
   USE_SECRETS_MANAGER=true
   # GITHUB_TOKEN は不要（コメントアウト可）
   ```
3. **デプロイ実行**
   ```bash
   cd infra
   npx cdk deploy -c repositoryOwner=YOUR_USER -c repositoryName=next-amplify-starter-kit
   ```

---

## ✅ シナリオ3: GitHub Actions (OIDC + Secrets Manager)
**目的**: 推奨される CI/CD 構成を確認する。

1. **Secrets Manager**
   - シナリオ2で作成済みであればスキップ可。

2. **AWS OIDC 設定**
   - IAM プロバイダーとロールを作成し、GitHub Actions からのアクセスを許可します。
   - 詳細は `deployment.md` 参照。

3. **GitHub Secrets 設定**
   - リポジトリの Settings > Secrets and variables > Actions
   - `AWS_ROLE_ARN`: 作成した IAM ロールの ARN

4. **デプロイ実行（手動トリガー）**
   - GitHub Actions タブ > "Deploy Infrastructure"
   - "Run workflow" をクリック
   - Environment: `production`
   - Use Secrets Manager: `true`

---

## ✅ シナリオ4: GitHub Actions (Access Key + 環境変数)
**目的**: OIDC 未設定環境でのコスト削減 CI/CD を確認する。

1. **GitHub Secrets 設定**
   - `AWS_ACCESS_KEY_ID`: IAM ユーザーのキー
   - `AWS_SECRET_ACCESS_KEY`: IAM ユーザーのシークレット
   - `GH_PAT`: GitHub トークン

2. **GitHub Variables 設定**
   - `AUTH_METHOD`: `ACCESS_KEY` (OIDC無効化のため明示的に設定推奨)

3. **デプロイ実行（手動トリガー）**
   - GitHub Actions タブ > "Deploy Infrastructure"
   - "Run workflow" をクリック
   - Use Secrets Manager: `false`

---

## 🧹 クリーンアップ手順

検証が終わったら、無駄なコストが発生しないようにリソースを削除します。

1. **Amplify アプリの削除**
   ```bash
   cd infra
   npx cdk destroy
   ```
   または AWS コンソールから CloudFormation スタック (`AmplifyStack`) を削除。

2. **Secrets Manager の削除**
   ```bash
   aws secretsmanager delete-secret --secret-id github/amplify-token --force-delete-without-recovery
   ```

3. **ユーザー/ロールの削除**
   - 作成した IAM ユーザーや OIDC ロールを削除。
