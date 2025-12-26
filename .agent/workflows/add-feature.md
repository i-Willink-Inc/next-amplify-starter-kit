---
description: Add a new optional feature to the starter kit
---

## Overview

This workflow defines the procedure for adding customizable optional features to the starter kit.
Examples: AWS SES email sending, authentication, database integration, etc.

## Prerequisites

- Feature requirements must be clear
- Required AWS services and external services must be identified

## Procedure

### 1. Clarify Requirements

Confirm the following with the user:

- **Purpose of Feature**: What to achieve
- **Services to Use**: AWS services, external APIs, etc.
- **Flexibility of Configuration**: Which parts should be customizable
- **Prerequisites**: Route53, domain, account settings, etc.

### 2. Create Implementation Plan

Plan with the following structure:

| Component | Description |
|-----------|-------------|
| CDK Stack | Definition of infrastructure resources |
| Next.js API | Backend processing |
| UI Components | Frontend (if necessary) |
| Environment Variables | Configurable parameters |
| Documentation | Setup and usage instructions |

### 3. Implement CDK Stack

Create a new Stack in `infra/lib/`:

```typescript
// infra/lib/[feature]-stack.ts
export class FeatureStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: FeatureStackProps) {
        super(scope, id, props);
        // Resource definitions
    }
}
```

**Design Points:**
- Toggle on/off via environment variables
- Integration with related AWS services (Route53, IAM, etc.)
- Creation of necessary IAM policies

### 4. Update CDK Entry Point

Add the stack conditionally in `infra/bin/app.ts`:

```typescript
// Deploy only if environment variable is set
if (process.env.FEATURE_ENABLED) {
    new FeatureStack(app, 'FeatureStack', { ... });
}
```

### 5. Update Environment Variable Templates

Add settings to the following files:

- `infra/.env.example` - For CDK
- `apps/web/.env.local.example` - For Next.js

**Format:**
```bash
# =============================================================================
# [Feature Name] Configuration (Optional)
# =============================================================================
# Description comment
# FEATURE_VAR=value
```

### 6. Implement Next.js API

Create `apps/web/src/app/api/[feature]/route.ts`:

- Validation with Zod
- Usage of AWS SDK v3
- Proper error handling
- CORS support

### 7. Implement Utility Functions

Create `apps/web/src/lib/[feature]-client.ts`:

- Reusable functions
- TypeScript type definitions
- JSDoc comments

### 8. Create Sample/Demo Page

Create `apps/web/src/app/[feature]/page.tsx`:

- For verifying feature operation
- Display "Demo page" label
- Match starter kit design

### 9. Create Documentation

Create `docs/20_development/[feature]-guide.md`:

**Required Sections:**
- Overview
- Prerequisites
- Setup Procedure (Both CDK Auto/Manual)
- Usage
- API Reference
- Pricing Information (If applicable)
- Troubleshooting

### 10. Update README

Update the following:

- Add feature to features table
- Add documentation link

### 11. Build Verification

```bash
# Next.js Build
cd apps/web && pnpm build

# CDK Build
cd infra && pnpm build
```

// turbo

### 12. Commit and Update CHANGELOG

```bash
# Commit
git add .
git commit -m "feat([feature]): [Description of feature]"

# Update CHANGELOG
# Run /changelog workflow
```

## Checklist

- [ ] Created CDK Stack
- [ ] Updated environment variable templates
- [ ] Implemented Next.js API
- [ ] Created utility functions
- [ ] Created sample page
- [ ] Created documentation
- [ ] Updated README
- [ ] Build succeeded
- [ ] Committed changes
- [ ] Updated CHANGELOG

## Reference: Existing Feature Implementations

| Feature | Stack | Documentation |
|---------|-------|---------------|
| AWS SES | `infra/lib/ses-stack.ts` | `docs/20_development/ses-email-guide.md` |
