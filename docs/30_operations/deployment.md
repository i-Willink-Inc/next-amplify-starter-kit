# Deployment Guide

[日本語 (Japanese)](deployment.ja.md)

> **Last Updated**: 2025-12-16
> **Status**: Approved

## Overview

This project uses AWS Amplify to host the Next.js application.
It supports two deployment methods: **Manual from Local** and **Automatic from GitHub Actions**.

---

## GitHub Token Management

| Method | Recommendation | Security | Cost |
|--------|----------------|----------|------|
| **Secrets Manager (Default)** | ⭐ Recommended | ◎ High | Approx $0.40/month |
| Environment Variable | For Development | ○ Medium | Free |

### How to Switch

```bash
# Default: Use Secrets Manager (Recommended)
npx cdk deploy

# Cost Reduction: Use Environment Variables
USE_SECRETS_MANAGER=false GITHUB_TOKEN=ghp_xxx npx cdk deploy
```

---

## Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: CDK Deploy (Local or GitHub Actions)                   │
│          → Create Amplify service on AWS                        │
│          → Set up GitHub repository connection                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Merge to main branch                                   │
│          → Amplify automatically detects changes                │
│          → Build and deploy according to amplify.yml            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Preparation

### 1. Create GitHub Personal Access Token (PAT)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token"
3. Select Scopes:
   - `repo` (Full control of private repositories)
   - `admin:repo_hook` (Full control of repository hooks)
4. Copy and securely save the token

### 2. Save GitHub Token (Select Method)

#### Method A: Secrets Manager (Recommended)

```bash
aws secretsmanager create-secret \
  --name github/amplify-token \
  --secret-string "ghp_xxxxxxxxxxxxxxxx" \
  --region ap-northeast-1 # Example region
```

#### Method B: Environment Variable (Cost Reduction)

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
export USE_SECRETS_MANAGER=false
```

---

## Pattern 1: Deployment from Local

### 1.1 AWS Auth Setup

**Method A: .env file (Recommended)**

Create `infra/.env` file and set necessary values (refer to `.env.example`).

```bash
cp infra/.env.example infra/.env
# Edit infra/.env to set credentials
```

**Method B: Environment Variables (Export directly)**
```bash
export AWS_ACCESS_KEY_ID=xxxxx
export AWS_SECRET_ACCESS_KEY=xxxxx
export AWS_DEFAULT_REGION=ap-northeast-1 # Example region
```

**Method C: AWS SSO**
```bash
aws sso login --profile your-profile
export AWS_PROFILE=your-profile
```

### 1.2 CDK Deploy

```bash
cd infra

# Loaded automatically if .env file exists
npx cdk deploy

# Or use environment variables (Cost Reduction)
USE_SECRETS_MANAGER=false GITHUB_TOKEN=ghp_xxx npx cdk deploy
```

---

## Pattern 2: Deployment from GitHub Actions

### 2.1 GitHub Secrets Setup

| Secret Name | Value | Usage |
|-------------|-------|-------|
| `GH_PAT` | `ghp_xxxxxxxx` | GitHub PAT (Only required if USE_SECRETS_MANAGER=false) |
| `AWS_ROLE_ARN` | `arn:aws:iam::xxx:role/xxx` | For OIDC Auth |

Or:

| Secret Name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | Access Key ID |
| `AWS_SECRET_ACCESS_KEY` | Secret Key |

### 2.2 Workflow Trigger

- **Auto**: When changes in `infra/` or `amplify.yml` are merged to `main`
- **Manual**: Actions → Deploy Infrastructure → Run workflow
  - `use_secrets_manager`: `true` (Recommended) or `false` (Cost Reduction)

---

## Custom Domain Setup (Optional)

You can apply a domain registered in Route53 to the Amplify app.
If set, the root domain (`example.com`) and `www` subdomain (`www.example.com`) are automatically configured.

> **Prerequisite**: Hosted Zone must be created in Route53 of the same AWS account.

### Setup Method

**Local Deploy (.env)**
```bash
# infra/.env
DOMAIN_NAME=example.com
```

**Local Deploy (Context)**
```bash
npx cdk deploy -c domainName=example.com
```

**GitHub Actions**
Currently, you need to add settings to pass the `DOMAIN_NAME` environment variable (Modify workflow as needed).

---

## Prerequisite Permissions

The following permissions are required for deployment.

### 1. AWS IAM Permission (Deployer)

The IAM user or role executing CDK deploy needs the following permissions.
The easiest recommendation is to attach **`AdministratorAccess`** policy.

For least privilege operation, full access to the following services is required:
- **CloudFormation**: Create/Update stacks
- **S3**: Upload asset files
- **IAM**: Create roles for Amplify (including PassRole)
- **Amplify**: Create App/Branch/Backend
- **Secrets Manager**: Read permission (When using Secrets Manager)
- **SSM**: Read CDK Bootstrap related parameters

### 2. GitHub Personal Access Token (PAT)

Requires `repo` and `admin:repo_hook` scopes (See [Step 1](#1-create-github-personal-access-token-pat)).

---

## Required Configuration List

### Using Secrets Manager (Recommended)

| Location | Name | Description |
|----------|------|-------------|
| AWS Secrets Manager | `github/amplify-token` | GitHub PAT |
| GitHub Secrets | `AWS_ROLE_ARN` or `AWS_ACCESS_KEY_ID` | AWS Auth |

### Using Environment Variables (Cost Reduction)

| Location | Name | Description |
|----------|------|-------------|
| GitHub Secrets | `GH_PAT` | GitHub PAT |
| GitHub Secrets | `AWS_ROLE_ARN` or `AWS_ACCESS_KEY_ID` | AWS Auth |
| Local / CI | `USE_SECRETS_MANAGER=false` | Switch flag |

---

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `Secrets Manager secret not found` | Secret not created | Run `aws secretsmanager create-secret` |
| `GitHub token is required` | `GITHUB_TOKEN` not set despite `USE_SECRETS_MANAGER=false` | Set environment variable |
| `Access Denied` | Insufficient IAM permissions | Grant necessary permissions |
