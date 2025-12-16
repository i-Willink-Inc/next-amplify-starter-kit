import * as cdk from 'aws-cdk-lib';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as fs from 'fs';
import * as path from 'path';
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

    /**
     * GitHub Personal Access Token (used when USE_SECRETS_MANAGER=false)
     * @default - Retrieved from environment variable GITHUB_TOKEN
     */
    readonly githubToken?: string;

    /**
     * Secrets Manager secret name for GitHub token
     * @default 'github/amplify-token'
     */

    readonly githubTokenSecretName?: string;

    /**
     * Custom domain name (optional)
     * @default - Retrieved from context or environment variable DOMAIN_NAME
     */
    readonly domainName?: string;
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

        // Determine GitHub token source
        // Default: Use Secrets Manager (recommended)
        // If USE_SECRETS_MANAGER=false: Use environment variable (cost reduction option)
        const useSecretsManager = process.env.USE_SECRETS_MANAGER !== 'false';
        const githubToken = this.resolveGitHubToken(props, useSecretsManager);

        // Read buildSpec from amplify.yml file (single source of truth)
        const buildSpec = fs.readFileSync(
            path.join(__dirname, '../../amplify.yml'),
            'utf8'
        );

        // Amplify App
        this.amplifyApp = new amplify.CfnApp(this, 'AmplifyApp', {
            name: 'next-amplify-starter-kit',
            repository: `https://github.com/${repoOwner}/${repoName}`,
            accessToken: githubToken,
            platform: 'WEB_COMPUTE', // Required for Next.js SSR
            buildSpec: buildSpec,
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

        // Domain management
        const domainName =
            props?.domainName ||
            this.node.tryGetContext('domainName') ||
            process.env.DOMAIN_NAME;

        if (domainName) {
            new amplify.CfnDomain(this, 'AmplifyDomain', {
                appId: this.amplifyApp.attrAppId,
                domainName: domainName,
                subDomainSettings: [
                    {
                        branchName: this.mainBranch.branchName,
                        prefix: '',
                    },
                    {
                        branchName: this.mainBranch.branchName,
                        prefix: 'www',
                    },
                ],
            });

            new cdk.CfnOutput(this, 'CustomDomainUrl', {
                value: `https://${domainName}`,
                description: 'Custom Domain URL',
            });
        }

        new cdk.CfnOutput(this, 'TokenSource', {
            value: useSecretsManager ? 'Secrets Manager' : 'Environment Variable',
            description: 'GitHub Token Source',
        });
    }

    /**
     * Resolve GitHub token based on configuration
     * - Default (USE_SECRETS_MANAGER not set or true): Use Secrets Manager
     * - USE_SECRETS_MANAGER=false: Use environment variable
     */
    private resolveGitHubToken(
        props: AmplifyStackProps | undefined,
        useSecretsManager: boolean
    ): string {
        if (useSecretsManager) {
            // Recommended: Use Secrets Manager
            const secretName = props?.githubTokenSecretName || 'github/amplify-token';
            const secret = secretsmanager.Secret.fromSecretNameV2(
                this,
                'GitHubToken',
                secretName
            );
            return secret.secretValue.unsafeUnwrap();
        } else {
            // Cost reduction option: Use environment variable
            const token =
                props?.githubToken ||
                this.node.tryGetContext('githubToken') ||
                process.env.GITHUB_TOKEN;

            if (!token) {
                throw new Error(
                    'GitHub token is required when USE_SECRETS_MANAGER=false. ' +
                    'Set GITHUB_TOKEN environment variable or pass via context/props.'
                );
            }
            return token;
        }
    }
}
