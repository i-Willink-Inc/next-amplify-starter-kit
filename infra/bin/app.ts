#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AmplifyStack } from '../lib/amplify-stack';

const app = new cdk.App();

new AmplifyStack(app, 'NextAmplifyStarterKit', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
    },
    description: 'Next.js Amplify Starter Kit - Hosting Infrastructure',
});
