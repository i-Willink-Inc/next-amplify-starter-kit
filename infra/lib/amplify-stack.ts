import * as cdk from 'aws-cdk-lib';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface AmplifyStackProps extends cdk.StackProps {
    /**
     * GitHub repository owner/organization
     * @default - Retrieved from context or environment
     */
    readonly repositoryOwner?: string;

    /**
     * GitHub repository name
     * @default - Retrieved from context or environment
     */
    readonly repositoryName?: string;
}

export class AmplifyStack extends cdk.Stack {
    public readonly amplifyApp: amplify.CfnApp;
    public readonly mainBranch: amplify.CfnBranch;

    constructor(scope: Construct, id: string, props?: AmplifyStackProps) {
        super(scope, id, props);

        // Get configuration from context or use defaults
        const repoOwner =
            props?.repositoryOwner ||
            this.node.tryGetContext('repositoryOwner') ||
            'i-Willink-Inc';
        const repoName =
            props?.repositoryName ||
            this.node.tryGetContext('repositoryName') ||
            'next-amplify-starter-kit';

        // Reference to GitHub token stored in Secrets Manager
        const githubTokenSecret = secretsmanager.Secret.fromSecretNameV2(
            this,
            'GitHubToken',
            'github/amplify-token'
        );

        // Amplify App
        this.amplifyApp = new amplify.CfnApp(this, 'AmplifyApp', {
            name: 'next-amplify-starter-kit',
            repository: `https://github.com/${repoOwner}/${repoName}`,
            accessToken: githubTokenSecret.secretValue.unsafeUnwrap(),
            platform: 'WEB_COMPUTE', // Required for Next.js SSR
            buildSpec: this.getBuildSpec(),
            customRules: [
                {
                    source: '/<*>',
                    target: '/index.html',
                    status: '404-200',
                },
            ],
            environmentVariables: [
                {
                    name: 'AMPLIFY_MONOREPO_APP_ROOT',
                    value: 'apps/web',
                },
                {
                    name: '_CUSTOM_IMAGE',
                    value: 'amplify:al2023',
                },
            ],
        });

        // Main branch
        this.mainBranch = new amplify.CfnBranch(this, 'MainBranch', {
            appId: this.amplifyApp.attrAppId,
            branchName: 'main',
            enableAutoBuild: true,
            stage: 'PRODUCTION',
            framework: 'Next.js - SSR',
        });

        // Outputs
        new cdk.CfnOutput(this, 'AmplifyAppId', {
            value: this.amplifyApp.attrAppId,
            description: 'Amplify App ID',
        });

        new cdk.CfnOutput(this, 'AmplifyDefaultDomain', {
            value: this.amplifyApp.attrDefaultDomain,
            description: 'Amplify Default Domain',
        });

        new cdk.CfnOutput(this, 'ProductionUrl', {
            value: `https://main.${this.amplifyApp.attrDefaultDomain}`,
            description: 'Production URL',
        });
    }

    private getBuildSpec(): string {
        return `version: 1
applications:
  - appRoot: apps/web
    frontend:
      phases:
        preBuild:
          commands:
            - corepack enable
            - corepack prepare pnpm@latest --activate
            - pnpm install --frozen-lockfile
        build:
          commands:
            - pnpm build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
`;
    }
}
