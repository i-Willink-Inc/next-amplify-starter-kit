# AWS SES メール機能ガイド

[English](ses-email-guide.md)

このドキュメントでは、Next.js Amplify Starter Kit に組み込まれた AWS SES（Simple Email Service）を使ったメール送信機能について説明します。

---

## 📋 目次

- [概要](#-概要)
- [セットアップ](#-セットアップ)
- [使用方法](#-使用方法)
- [API リファレンス](#-api-リファレンス)
- [SES サンドボックスモード](#-ses-サンドボックスモード)
- [料金](#-料金)
- [トラブルシューティング](#-トラブルシューティング)

---

## 📋 概要

### 機能

- **Next.js API Routes** を使ったサーバーサイドでのメール送信
- **Zod** によるリクエストバリデーション
- **AWS SDK v3** による効率的な SES 連携
- 柔軟な送信先設定（環境変数、フォーム入力、API パラメータ）
- HTML メール対応
- CDK による自動インフラ構築

### アーキテクチャ

```
┌──────────────┐      ┌──────────────────┐      ┌─────────────┐
│  Contact     │ POST │  Next.js API     │      │  AWS SES    │
│  Form        │──────│  /api/contact    │──────│             │
│  (Client)    │      │  (Server)        │      │  Email      │
└──────────────┘      └──────────────────┘      └─────────────┘
```

---

## 🔧 セットアップ

### 前提条件

SES メール機能を使用するには、以下の前提条件が必要です。

| 項目 | 必須 | 説明 |
|-----|------|------|
| AWS アカウント | ✅ | SES を利用するため |
| AWS CLI 設定済み | ✅ | `aws configure` で認証情報を設定 |
| Route53 ホストゾーン | 推奨 | ドメイン検証に使用（自動 DKIM 設定） |
| 独自ドメイン | 推奨 | 本番運用ではドメイン検証を推奨 |

> [!IMPORTANT]
> **ドメイン検証 vs メールアドレス検証**
> 
> - **メールアドレス検証**: 特定のメールアドレスのみ送信元として使用可能
> - **ドメイン検証**: ドメイン配下の全てのメールアドレスが送信元として使用可能（推奨）

### 1. 環境変数の設定

#### ローカル開発環境

`apps/web/.env.local` ファイルを作成し、以下の環境変数を設定します：

```bash
# AWS Credentials (AWS CLI で設定済みの場合は不要)
# AWS_ACCESS_KEY_ID=your-access-key-id
# AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=ap-northeast-1

# SES Configuration
SES_FROM_EMAIL=noreply@yourdomain.com
SES_TO_EMAIL=contact@yourdomain.com
```

#### 本番環境（Amplify）

Amplify コンソールで環境変数を設定します：

1. Amplify コンソール → アプリ → 環境変数
2. 以下の変数を追加：
   - `SES_FROM_EMAIL`
   - `SES_TO_EMAIL`
   - `SES_REGION` (オプション)

> **Note**: AWS 認証情報は Amplify の実行ロールから自動的に取得されるため、`AWS_ACCESS_KEY_ID` などは不要です。

### 2. SES ドメイン検証（推奨）

ドメイン検証を行うと、そのドメイン配下の全てのメールアドレスから送信できるようになります。

#### 方法A: CDK で自動設定（Route53 使用時・推奨）

Route53 でドメインを管理している場合、CDK で DKIM レコードを自動作成できます。

1. **Hosted Zone ID を確認**
   ```bash
   aws route53 list-hosted-zones --query "HostedZones[*].[Id,Name]" --output table
   ```

2. **`infra/.env` に設定を追加**
   ```bash
   SES_DOMAIN=yourdomain.com
   ROUTE53_HOSTED_ZONE_ID=Z0123456789ABCDEFGHIJ
   ```

3. **CDK デプロイを実行**
   ```bash
   cd infra
   npx cdk deploy SesStack
   ```

   DKIM CNAME レコードが自動的に Route53 に追加され、数分で検証が完了します。

#### 方法B: 手動で DNS レコードを設定

Route53 以外の DNS プロバイダを使用している場合：

1. **CDK デプロイ（ROUTE53_HOSTED_ZONE_ID なし）**
   ```bash
   SES_DOMAIN=yourdomain.com
   cd infra && npx cdk deploy SesStack
   ```

2. **出力された DKIM トークンを確認**
   デプロイ出力に3つの DKIM トークンが表示されます。

3. **DNS プロバイダで CNAME レコードを追加**
   
   各トークンに対して、以下の形式で CNAME レコードを追加：
   
   | Name | Type | Value |
   |------|------|-------|
   | `{token1}._domainkey.yourdomain.com` | CNAME | `{token1}.dkim.amazonses.com` |
   | `{token2}._domainkey.yourdomain.com` | CNAME | `{token2}.dkim.amazonses.com` |
   | `{token3}._domainkey.yourdomain.com` | CNAME | `{token3}.dkim.amazonses.com` |

4. **検証完了を確認**
   ```bash
   aws sesv2 get-email-identity --email-identity yourdomain.com --query "DkimAttributes.Status"
   # "SUCCESS" と表示されれば完了
   ```

### 3. SES メールアドレス検証（シンプル）

特定のメールアドレスのみを検証する場合：

#### AWS コンソールで検証する場合

1. AWS コンソール → SES → Verified identities
2. 「Create identity」→「Email address」を選択
3. 送信元メールアドレスを入力
4. 送信された確認メールのリンクをクリック

#### CLI で検証する場合

```bash
aws sesv2 create-email-identity --email-identity noreply@yourdomain.com --region ap-northeast-1
# メールが届くので、確認リンクをクリック
```

---

## 📧 使用方法

### サンプル問い合わせページ

スターターキットには、検証用のサンプル問い合わせページが含まれています：

- **URL**: `/contact`
- **ソース**: `apps/web/src/app/contact/page.tsx`

開発サーバーを起動して動作を確認できます：

```bash
pnpm dev
# http://localhost:3000/contact にアクセス
```

### API を直接呼び出す

```typescript
const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: '山田太郎',
        email: 'yamada@example.com',
        subject: 'お問い合わせ',
        message: 'お問い合わせ内容をここに記入します。',
    }),
});

const result = await response.json();
if (result.success) {
    console.log('送信成功:', result.messageId);
} else {
    console.error('送信失敗:', result.error);
}
```

### ses-client を直接使用する

サーバーサイドのコードから直接 `ses-client` を使用することもできます：

```typescript
import { sendContactEmail, sendEmail } from '@/lib/ses-client';

// 問い合わせメール形式で送信
await sendContactEmail({
    name: '山田太郎',
    email: 'yamada@example.com',
    subject: 'お問い合わせ',
    message: 'メッセージ本文',
});

// カスタム形式で送信
await sendEmail({
    to: ['recipient1@example.com', 'recipient2@example.com'],
    subject: 'カスタムメール',
    body: 'プレーンテキスト本文',
    htmlBody: '<h1>HTML本文</h1>',
    replyTo: 'reply@example.com',
});
```

---

## 📖 API リファレンス

### POST /api/contact

お問い合わせフォームからのメール送信 API です。

#### リクエスト

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `name` | string | ✅ | 送信者名（1-100文字） |
| `email` | string | ✅ | 送信者メールアドレス |
| `subject` | string | - | 件名（0-200文字） |
| `message` | string | ✅ | メッセージ本文（1-5000文字） |
| `to` | string \| string[] | - | 追加の送信先 |

#### レスポンス

**成功時 (200)**
```json
{
    "success": true,
    "messageId": "0102018d1234abcd-12345678-1234-1234-1234-123456789abc-000000"
}
```

**バリデーションエラー (400)**
```json
{
    "success": false,
    "error": "Validation failed",
    "details": [
        {
            "code": "too_small",
            "minimum": 1,
            "type": "string",
            "inclusive": true,
            "exact": false,
            "message": "Name is required",
            "path": ["name"]
        }
    ]
}
```

**サーバーエラー (500)**
```json
{
    "success": false,
    "error": "Email was rejected. Please check if the sender email is verified in SES."
}
```

---

## ⚠️ SES サンドボックスモード

### サンドボックスモードとは

**新規 AWS アカウントでは、SES はサンドボックモードで動作します。**

サンドボックモードでは以下の制限があります：

| 制限 | 内容 |
|-----|------|
| 送信先 | **検証済みのメールアドレスにのみ** 送信可能 |
| 送信量 | 1日200通まで |
| 送信レート | 1秒あたり1通まで |

### サンドボックスを解除する方法

本番環境でメール機能を使用するには、サンドボックの解除申請が必要です。

1. AWS コンソール → SES → Account dashboard
2. 「Request production access」をクリック
3. 以下の情報を入力：
   - **Mail type**: Transactional（トランザクションメール）
   - **Website URL**: あなたのウェブサイトURL
   - **Use case description**: メールの使用目的を説明
     - 例：「お問い合わせフォームからの通知メール送信に使用します」
4. 送信して AWS からの承認を待つ（通常24-48時間）

### 開発時の対処

サンドボックスモードでも開発・テストは可能です：

1. **送信元メールアドレスを検証**
   - SES → Verified identities → Create identity
   - メールで届くリンクをクリック

2. **送信先メールアドレスも検証**
   - 開発中はテスト用の送信先も検証が必要
   - 同様に SES で検証を行う

3. **検証済みメールアドレス間でテスト**
   - 送信元・送信先ともに検証済みであればメール送信可能

---

## 💰 料金

AWS SES の料金は非常に低コストです。詳細は公式の料金ページをご確認ください。

📌 **[AWS SES 料金ページ](https://aws.amazon.com/jp/ses/pricing/)**

### 料金の概要

| 項目 | 料金 |
|-----|------|
| EC2 / Amplify からの送信 | **最初の 62,000 通/月は無料**、以降 $0.10/1,000通 |
| その他からの送信 | $0.10/1,000通 |
| 添付ファイル | $0.12/GB |
| 受信 | 最初の 1,000 通/月は無料、以降 $0.10/1,000通 |

> **Note**: 上記は概算です。最新の正確な料金は [公式料金ページ](https://aws.amazon.com/jp/ses/pricing/) をご確認ください。

### コスト試算例

| ユースケース | 月間送信数 | 概算コスト |
|------------|----------|----------|
| 小規模サイトの問い合わせ | 100通 | **無料** |
| 中規模サイト | 5,000通 | **無料** |
| 大規模サイト | 100,000通 | 約 $3.80 |

---

## 🔍 トラブルシューティング

### よくあるエラー

#### 「Email was rejected」

**原因**: 送信元メールアドレスが SES で検証されていない

**解決方法**:
1. SES コンソールで送信元メールアドレスを検証
2. 確認メールのリンクをクリック
3. 環境変数 `SES_FROM_EMAIL` が正しいか確認

#### 「No recipient specified」

**原因**: 送信先が指定されていない

**解決方法**:
1. 環境変数 `SES_TO_EMAIL` を設定
2. または API リクエストで `to` パラメータを指定

#### 「Access Denied」

**原因**: IAM 権限が不足している

**解決方法**:
1. Amplify の実行ロールに SES 送信権限を追加
2. CDK でデプロイした場合は `SesSendPolicy` をロールにアタッチ

#### サンドボックスでの送信エラー

**原因**: 送信先メールアドレスが検証されていない

**解決方法**:
1. 送信先メールアドレスも SES で検証
2. または本番アクセスを申請

### ログの確認

API エラーは Next.js のサーバーログに出力されます：

```bash
# 開発時
pnpm dev
# コンソールでエラーメッセージを確認

# Amplify 本番環境
# Amplify コンソール → Monitoring → Access logs
```

---

## 📁 関連ファイル

| ファイル | 説明 |
|---------|------|
| `apps/web/src/lib/ses-client.ts` | SES クライアントとメール送信ユーティリティ |
| `apps/web/src/app/api/contact/route.ts` | 問い合わせ API エンドポイント |
| `apps/web/src/app/contact/page.tsx` | サンプル問い合わせページ |
| `apps/web/.env.local.example` | 環境変数テンプレート |
| `infra/lib/ses-stack.ts` | SES リソースの CDK 定義 |
| `infra/.env.example` | インフラ環境変数テンプレート |
