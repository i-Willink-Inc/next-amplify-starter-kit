export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="text-center space-y-8">
                <h1 className="text-5xl font-bold text-white tracking-tight">
                    Next.js Amplify
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        Starter Kit
                    </span>
                </h1>

                <p className="text-xl text-gray-300 max-w-2xl">
                    A modern monorepo starter kit powered by Next.js, AWS Amplify, CDK, and Turborepo.
                </p>

                <div className="flex gap-4 justify-center flex-wrap">
                    <a
                        href="https://nextjs.org/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Next.js Docs
                    </a>
                    <a
                        href="https://docs.amplify.aws/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                    >
                        Amplify Docs
                    </a>
                </div>

                <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl">
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                        <h2 className="text-lg font-semibold text-white mb-2">🚀 Turborepo</h2>
                        <p className="text-gray-400 text-sm">
                            High-performance build system with intelligent caching.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                        <h2 className="text-lg font-semibold text-white mb-2">☁️ AWS CDK</h2>
                        <p className="text-gray-400 text-sm">
                            Infrastructure as Code for reproducible deployments.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                        <h2 className="text-lg font-semibold text-white mb-2">⚡ Amplify</h2>
                        <p className="text-gray-400 text-sm">
                            Seamless CI/CD and hosting for your Next.js app.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
