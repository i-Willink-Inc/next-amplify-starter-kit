# Next.js Amplify Starter Kit

[日本語 (Japanese)](README.ja.md)

[![CI](https://github.com/i-Willink-Inc/next-amplify-starter-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/i-Willink-Inc/next-amplify-starter-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A starter kit aggregating modern web development best practices. Features a monorepo structure with Next.js + AWS Amplify + CDK to launch web sites fastest and provide a scalable foundation.

---

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Deploy to AWS](#-deploy-to-aws)
- [Required Environment Variables & Secrets](#-required-environment-variables--secrets)
- [Available Commands](#-available-commands)
- [Documentation](#-documentation)

---

## ✨ Features

| Technology | Description |
|------------|-------------|
| 🚀 **Turborepo** | High-performance build system and monorepo management |
| ⚡ **Next.js 15** | App Router + React 19 + SSR support |
| ☁️ **AWS CDK** | Infrastructure as Code for reproducibility |
| 🎨 **Tailwind CSS** | Utility-first styling |
| 🔄 **GitHub Actions** | Complete CI/CD pipeline |
| 📦 **pnpm** | Fast and efficient package management |
| 🐳 **Devcontainer** | Consistent development environment |

---

## 📁 Project Structure

```
next-amplify-starter-kit/
├── apps/
│   └── web/                 # Next.js Application
├── packages/
│   ├── tsconfig/            # Shared TypeScript Config
│   └── eslint-config/       # Shared ESLint Config
├── infra/                   # AWS CDK Infrastructure Code
├── docs/                    # Documentation
│   ├── 00_project/          # Project Management
│   ├── 20_development/      # Development Guide
│   └── 30_operations/       # Operations Guide
└── .github/workflows/       # CI/CD Definitions
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Minimum Version | Recommended |
|------|-----------------|-------------|
| Node.js | 18.17.0 | 20.x LTS |
| pnpm | 8.0.0 | 9.x |
| Docker | - | Latest (When using Devcontainer) |

### 1. Clone the Repository

```bash
git clone https://github.com/i-Willink-Inc/next-amplify-starter-kit.git
cd next-amplify-starter-kit
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm dev
```

Access the application at http://localhost:3000.

### Using Devcontainer (Recommended)

1. Start Docker Desktop or Rancher Desktop.
2. Open the project in VS Code.
3. Command Palette (Ctrl+Shift+P) → **"Dev Containers: Reopen in Container"**

> **Note**: For Docker context settings, please refer to the [Devcontainer Guide](docs/20_development/devcontainer-guide.md).

---

## ☁️ Deploy to AWS

### Deploy Flow

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

### Pattern 1: Deploy from Local (Recommended for Initial Setup)

Easy deployment using `.env` file.

```bash
# 1. Setup Environment Variables
cp infra/.env.example infra/.env
# Edit infra/.env to set AWS credentials and GITHUB_TOKEN

# 2. CDK Deploy
cd infra
npx cdk deploy
```

### Pattern 2: Auto Deploy from GitHub Actions

1. Set credentials in GitHub Secrets (see below).
2. Modify files under `infra/` and merge to `main`.
3. GitHub Actions automatically executes CDK deploy.

For detailed instructions, refer to the [Deployment Guide](docs/30_operations/deployment.md).

---

## 🔐 Required Environment Variables & Secrets

### AWS Secrets Manager (Required)

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `github/amplify-token` | `ghp_xxxxxxxx` | GitHub Personal Access Token |

**Required GitHub PAT Scopes:**
- `repo` - Full control of private repositories
- `admin:repo_hook` - Full control of repository hooks

### Local Environment Variables (For Pattern 1)

| Environment Variable | Example | Description |
|----------------------|---------|-------------|
| `AWS_ACCESS_KEY_ID` | `AKIAXXXXXXXX` | IAM Access Key ID |
| `AWS_SECRET_ACCESS_KEY` | `xxxxxxxx` | IAM Secret Access Key |
| `AWS_DEFAULT_REGION` | `ap-northeast-1` | Default Region |

### GitHub Secrets (For Pattern 2)

#### Method A: OIDC Authentication (Recommended)

| Secret Name | Example |
|-------------|---------|
| `AWS_ROLE_ARN` | `arn:aws:iam::123456789012:role/GitHubActionsRole` |

#### Method B: Access Key Authentication

| Secret Name | Example |
|-------------|---------|
| `AWS_ACCESS_KEY_ID` | `AKIAXXXXXXXX` |
| `AWS_SECRET_ACCESS_KEY` | `xxxxxxxx` |

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm test` | Run tests |

### CDK Commands (infra/)

| Command | Description |
|---------|-------------|
| `npx cdk diff` | Compare stack with deployed version |
| `npx cdk deploy` | Deploy stack |
| `npx cdk synth` | Generate CloudFormation template |

---

## 📚 Documentation

| Document | Target | Description |
|----------|--------|-------------|
| [Documentation Rules](docs/00_project/DOCUMENT_RULES.md) | Developers | How to write documentation |
| [Getting Started](docs/20_development/getting-started.md) | Developers | Setting up development environment |
| [Devcontainer Guide](docs/20_development/devcontainer-guide.md) | Developers | How to use Docker dev environment |
| [Deployment Guide](docs/30_operations/deployment.md) | Operators | AWS deployment instructions |

---

## 🤝 Contribution

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
