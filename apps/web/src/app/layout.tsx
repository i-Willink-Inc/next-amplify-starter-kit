import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Next.js Amplify Starter Kit',
    description: 'A modern monorepo starter kit with Next.js, AWS Amplify, and CDK',
    keywords: ['Next.js', 'AWS', 'Amplify', 'CDK', 'Monorepo', 'Turborepo'],
    openGraph: {
        title: 'Next.js Amplify Starter Kit',
        description: 'A modern monorepo starter kit with Next.js, AWS Amplify, and CDK',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className="antialiased">{children}</body>
        </html>
    );
}
