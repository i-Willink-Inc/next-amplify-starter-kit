import * as cdk from 'aws-cdk-lib';
import * as amplify from 'aws-cdk-lib/aws-amplify';
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
     * GitHub Personal Access Token
     * @default - Retrieved from environment variable GITHUB_TOKEN
     */
    readonly githubToken?: string;
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

        // Get GitHub token from props, context, or environment variable
        const githubToken =
            props?.githubToken ||
            this.node.tryGetContext('githubToken') ||
            process.env.GITHUB_TOKEN;

        if (!githubToken) {
            throw new Error(
                'GitHub token is required. Set GITHUB_TOKEN environment variable or pass via context/props.'
            );
        }

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
    }
}
