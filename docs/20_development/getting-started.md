# Development Environment Setup

[日本語 (Japanese)](getting-started.ja.md)

> **Last Updated**: 2025-12-16
> **Status**: Approved

## Overview

This guide explains how to set up the development environment for Next.js Amplify Starter Kit.

## Prerequisites

| Tool | Minimum Version | Recommended |
|------|-----------------|-------------|
| Node.js | 18.17.0 | 20.x LTS |
| pnpm | 8.0.0 | 9.x |
| Git | 2.30.0 | Latest |

## Setup Procedures

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

You can access the application at http://localhost:3000.

## Build

```bash
pnpm build
```

## Code Quality Check

```bash
# Lint
pnpm lint

# Format
pnpm format
```

## Devcontainer (Optional)

You can use a unified development environment using Docker.

1. Start Docker Desktop or Rancher Desktop
2. Open the project in VS Code
3. Command Palette (Ctrl+Shift+P) → **"Dev Containers: Reopen in Container"**

For details, refer to [devcontainer-guide.md](./devcontainer-guide.md).

## Infrastructure (AWS CDK)

This project manages infrastructure using AWS CDK.
CDK code is included in the `infra/` directory.

For AWS deployment and infrastructure configuration, refer to:
- [Deployment Guide](../30_operations/deployment.md)
- [README.md - Deploy to AWS](../../README.md#deploy-to-aws)

## Next Steps

- [Documentation Rules](../00_project/DOCUMENT_RULES.md)
- [Project Plan](../00_project/PROJECT_PLAN.md)
