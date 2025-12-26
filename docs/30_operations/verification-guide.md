# Verification Guide

[日本語 (Japanese)](verification-guide.ja.md)

This guide explains the procedure to verify all implemented deployment patterns in a forked environment.

## 📋 Prerequisites

1. **Fork Repository**
   - Fork `next-amplify-starter-kit` to your account on GitHub.
   - Clone to local:
     ```bash
     git clone https://github.com/YOUR_USER/next-amplify-starter-kit.git
     cd next-amplify-starter-kit
     ```

2. **AWS Credentials**
   - Prepare an AWS account for verification.
   - Required permissions: `AdministratorAccess` (Recommended)

3. **GitHub Token**
   - Obtain a PAT with `repo`, `admin:repo_hook` scopes.

---

## ✅ Scenario 1: Local Deployment (Env Var Mode)
**Objective**: Verify easiest deployment without cost.

1. **Create `.env` file**
   ```bash
   cp infra/.env.example infra/.env
   ```
2. **Edit `.env`**
   ```properties
   # infra/.env
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   GITHUB_TOKEN=ghp_...
   USE_SECRETS_MANAGER=false  # Important
   ```
3. **Execute Deploy**
   ```bash
   cd infra
   npx cdk deploy -c repositoryOwner=YOUR_USER -c repositoryName=next-amplify-starter-kit
   ```
   > **Note**: Specify forked repository name via `-c` option or `.env`.

4. **Verify**
   - CloudFormation stack is created.
   - App is created in Amplify Console and build starts.

---

## ✅ Scenario 2: Local Deployment (Secrets Manager Mode)
**Objective**: Verify production recommended configuration (using Secrets Manager).

1. **Save to Secrets Manager**
   ```bash
   aws secretsmanager create-secret \
     --name github/amplify-token \
     --secret-string "ghp_xxxxxxxx"
   ```
2. **Edit `.env`**
   ```properties
   # infra/.env
   USE_SECRETS_MANAGER=true
   # GITHUB_TOKEN is not needed (can be commented out)
   ```
3. **Execute Deploy**
   ```bash
   cd infra
   npx cdk deploy -c repositoryOwner=YOUR_USER -c repositoryName=next-amplify-starter-kit
   ```

---

## ✅ Scenario 3: GitHub Actions (OIDC + Secrets Manager)
**Objective**: Verify recommended CI/CD configuration.

1. **Secrets Manager**
   - Skippable if created in Scenario 2.

2. **AWS OIDC Setup**
   - Create IAM provider and role, allow access from GitHub Actions.
   - See `deployment.md` for details.

3. **GitHub Secrets Setup**
   - Repository Settings > Secrets and variables > Actions
   - `AWS_ROLE_ARN`: ARN of created IAM Role

4. **Execute Deploy (Manual Trigger)**
   - GitHub Actions tab > "Deploy Infrastructure"
   - Click "Run workflow"
   - Environment: `production`
   - Use Secrets Manager: `true`

---

## ✅ Scenario 4: GitHub Actions (Access Key + Env Var)
**Objective**: Verify cost-saving CI/CD configuration without OIDC.

1. **GitHub Secrets Setup**
   - `AWS_ACCESS_KEY_ID`: IAM User Key
   - `AWS_SECRET_ACCESS_KEY`: IAM User Secret
   - `GH_PAT`: GitHub Token

2. **GitHub Variables Setup**
   - `AUTH_METHOD`: `ACCESS_KEY` (Recommended to set explicitly to disable OIDC)

3. **Execute Deploy (Manual Trigger)**
   - GitHub Actions tab > "Deploy Infrastructure"
   - Click "Run workflow"
   - Use Secrets Manager: `false`

---

## 🧹 Cleanup Procedure

After verification, delete resources to avoid unnecessary costs.

1. **Delete Amplify App**
   ```bash
   cd infra
   npx cdk destroy
   ```
   Or delete CloudFormation stack (`AmplifyStack`) from AWS Console.

2. **Delete Secrets Manager**
   ```bash
   aws secretsmanager delete-secret --secret-id github/amplify-token --force-delete-without-recovery
   ```

3. **Delete User/Role**
   - Delete created IAM User or OIDC Role.
