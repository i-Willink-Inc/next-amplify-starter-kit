# AWS SES Email Function Guide

[日本語 (Japanese)](ses-email-guide.ja.md)

This document explains the email sending function using AWS SES (Simple Email Service) integrated into the Next.js Amplify Starter Kit.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Setup](#-setup)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [SES Sandbox Mode](#-ses-sandbox-mode)
- [Pricing](#-pricing)
- [Troubleshooting](#-troubleshooting)

---

## 📋 Overview

### Features

- Server-side email sending using **Next.js API Routes**
- Request validation with **Zod**
- Efficient SES integration with **AWS SDK v3**
- Flexible sender/recipient settings (Environment variables, Form input, API params)
- HTML email support
- Automated infrastructure construction with CDK

### Architecture

```
┌──────────────┐      ┌──────────────────┐      ┌─────────────┐
│  Contact     │ POST │  Next.js API     │      │  AWS SES    │
│  Form        │──────│  /api/contact    │──────│             │
│  (Client)    │      │  (Server)        │      │  Email      │
└──────────────┘      └──────────────────┘      └─────────────┘
```

---

## 🔧 Setup

### Prerequisites

To use the SES email function, the following prerequisites are required.

| Item | Required | Description |
|------|----------|-------------|
| AWS Account | ✅ | To use SES |
| AWS CLI Configured | ✅ | Set credentials with `aws configure` |
| Route53 Hosted Zone | Recommended | Used for domain verification (Auto DKIM setup) |
| Custom Domain | Recommended | Domain verification is recommended for production |

> [!IMPORTANT]
> **Domain Verification vs Email Address Verification**
> 
> - **Email Address Verification**: Only specific email addresses can be used as sender
> - **Domain Verification**: All email addresses under the domain can be used as sender (Recommended)

### 1. Environment Variable Configuration

#### Local Development Environment

Create `apps/web/.env.local` file and set the following environment variables:

```bash
# AWS Credentials (Not needed if configured via AWS CLI)
# AWS_ACCESS_KEY_ID=your-access-key-id
# AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=ap-northeast-1

# SES Configuration
SES_FROM_EMAIL=noreply@yourdomain.com
SES_TO_EMAIL=contact@yourdomain.com
```

#### Production Environment (Amplify)

Set environment variables in the Amplify Console:

1. Amplify Console → App → Environment variables
2. Add the following variables:
   - `SES_FROM_EMAIL`
   - `SES_TO_EMAIL`
   - `SES_REGION` (Optional)

> **Note**: AWS credentials are automatically retrieved from Amplify's execution role, so `AWS_ACCESS_KEY_ID` etc. are not required.

### 2. SES Domain Verification (Recommended)

Domain verification allows sending from all email addresses under that domain.

#### Method A: Auto Setup via CDK (Recommended for Route53)

If managing domain with Route53, CDK can automatically create DKIM records.

1. **Check Hosted Zone ID**
   ```bash
   aws route53 list-hosted-zones --query "HostedZones[*].[Id,Name]" --output table
   ```

2. **Add settings to `infra/.env`**
   ```bash
   SES_DOMAIN=yourdomain.com
   ROUTE53_HOSTED_ZONE_ID=Z0123456789ABCDEFGHIJ
   ```

3. **Execute CDK Deploy**
   ```bash
   cd infra
   npx cdk deploy SesStack
   ```

   DKIM CNAME records will be automatically added to Route53, and verification completes in a few minutes.

#### Method B: Manual DNS Record Setup

If using a DNS provider other than Route53:

1. **CDK Deploy (without ROUTE53_HOSTED_ZONE_ID)**
   ```bash
   SES_DOMAIN=yourdomain.com
   cd infra && npx cdk deploy SesStack
   ```

2. **Check Output DKIM Tokens**
   3 DKIM tokens will be displayed in the deployment output.

3. **Add CNAME Records in DNS Provider**
   
   Add CNAME records for each token in the following format:
   
   | Name | Type | Value |
   |------|------|-------|
   | `{token1}._domainkey.yourdomain.com` | CNAME | `{token1}.dkim.amazonses.com` |
   | `{token2}._domainkey.yourdomain.com` | CNAME | `{token2}.dkim.amazonses.com` |
   | `{token3}._domainkey.yourdomain.com` | CNAME | `{token3}.dkim.amazonses.com` |

4. **Verify Completion**
   ```bash
   aws sesv2 get-email-identity --email-identity yourdomain.com --query "DkimAttributes.Status"
   # Complete if "SUCCESS" is displayed
   ```

### 3. SES Email Address Verification (Simple)

To verify only specific email addresses:

#### Verify via AWS Console

1. AWS Console → SES → Verified identities
2. "Create identity" → Select "Email address"
3. Enter sender email address
4. Click the link in the verification email sent

#### Verify via CLI

```bash
aws sesv2 create-email-identity --email-identity noreply@yourdomain.com --region ap-northeast-1
# Click the verification link in the received email
```

---

## 📧 Usage

### Sample Contact Page

The starter kit includes a sample contact page for validation:

- **URL**: `/contact`
- **Source**: `apps/web/src/app/contact/page.tsx`

You can verify functionality by starting the development server:

```bash
pnpm dev
# Access http://localhost:3000/contact
```

### Calling API Directly

```typescript
const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Inquiry',
        message: 'Content of the inquiry here.',
    }),
});

const result = await response.json();
if (result.success) {
    console.log('Success:', result.messageId);
} else {
    console.error('Failed:', result.error);
}
```

### Using ses-client Directly

You can use `ses-client` directly from server-side code:

```typescript
import { sendContactEmail, sendEmail } from '@/lib/ses-client';

// Send in contact email format
await sendContactEmail({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Inquiry',
    message: 'Message body',
});

// Send in custom format
await sendEmail({
    to: ['recipient1@example.com', 'recipient2@example.com'],
    subject: 'Custom Email',
    body: 'Plain text body',
    htmlBody: '<h1>HTML Body</h1>',
    replyTo: 'reply@example.com',
});
```

---

## 📖 API Reference

### POST /api/contact

API endpoint for sending email from contact form.

#### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Sender name (1-100 chars) |
| `email` | string | ✅ | Sender email address |
| `subject` | string | - | Subject (0-200 chars) |
| `message` | string | ✅ | Message body (1-5000 chars) |
| `to` | string \| string[] | - | Additional recipients |

#### Response

**Success (200)**
```json
{
    "success": true,
    "messageId": "0102018d1234abcd-12345678-1234-1234-1234-123456789abc-000000"
}
```

**Validation Error (400)**
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

**Server Error (500)**
```json
{
    "success": false,
    "error": "Email was rejected. Please check if the sender email is verified in SES."
}
```

---

## ⚠️ SES Sandbox Mode

### What is Sandbox Mode

**New AWS accounts operate SES in Sandbox Mode.**

Sandbox Mode has the following limitations:

| Limitation | Content |
|------------|---------|
| Recipients | **Only verified email addresses** can be recipients |
| Volume | Up to 200 emails/day |
| Rate | Up to 1 email/sec |

### How to Move out of Sandbox

To use email function in production, you need to request production access.

1. AWS Console → SES → Account dashboard
2. Click "Request production access"
3. Enter information:
   - **Mail type**: Transactional
   - **Website URL**: Your website URL
   - **Use case description**: Explain purpose
     - Ex: "Used for notification emails from contact form"
4. Submit and wait for AWS approval (Usually 24-48 hours)

### Handling during Development

Development and testing are possible in Sandbox Mode:

1. **Verify Sender Email Address**
   - SES → Verified identities → Create identity
   - Click link in confirmation email

2. **Verify Recipient Email Address**
   - Validation required for recipient address during dev
   - Validate in SES similarly

3. **Test between verified email addresses**
   - Sending possible if both sender/recipient are verified

---

## 💰 Pricing

AWS SES pricing is very low cost. See official pricing page for details.

📌 **[AWS SES Pricing](https://aws.amazon.com/ses/pricing/)**

### Pricing Overview

| Item | Price |
|------|-------|
| Sending from EC2 / Amplify | **First 62,000 emails/month free**, then $0.10/1,000 emails |
| Sending from others | $0.10/1,000 emails |
| Attachments | $0.12/GB |
| Receiving | First 1,000 emails/month free, then $0.10/1,000 emails |

> **Note**: Above are estimates. Please check [Official Pricing Page](https://aws.amazon.com/ses/pricing/) for latest accurate pricing.

### Cost Example

| Use Case | Monthly Volume | Estimated Cost |
|----------|----------------|----------------|
| Small Site Inquiry | 100 emails | **Free** |
| Medium Site | 5,000 emails | **Free** |
| Large Site | 100,000 emails | Approx $3.80 |

---

## 🔍 Troubleshooting

### Common Errors

#### "Email was rejected"

**Cause**: Sender email address not verified in SES

**Solution**:
1. Verify sender email in SES console
2. Click confirmation email link
3. Check `SES_FROM_EMAIL` environment variable

#### "No recipient specified"

**Cause**: Recipient not specified

**Solution**:
1. Set `SES_TO_EMAIL` environment variable
2. Or specify `to` parameter in API request

#### "Access Denied"

**Cause**: Insufficient IAM permissions

**Solution**:
1. Add SES send permission to Amplify execution role
2. If deployed via CDK, attach `SesSendPolicy` to role

#### Sandbox Sending Error

**Cause**: Recipient email address not verified

**Solution**:
1. Verify recipient email in SES
2. Or request production access

### Checking Logs

API errors are output to Next.js server logs:

```bash
# Development
pnpm dev
# Check error message in console

# Amplify Production
# Amplify Console → Monitoring → Access logs
```

---

## 📁 Related Files

| File | Description |
|------|-------------|
| `apps/web/src/lib/ses-client.ts` | SES Client and Email Utility |
| `apps/web/src/app/api/contact/route.ts` | Contact API Endpoint |
| `apps/web/src/app/contact/page.tsx` | Sample Contact Page |
| `apps/web/.env.local.example` | Env Variable Template |
| `infra/lib/ses-stack.ts` | SES Resource CDK Definition |
| `infra/.env.example` | Infrastructure Env Variable Template |
