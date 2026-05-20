import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen bg-white dark:bg-black font-sans">
            {/* Left Panel - Visual / Brand (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-zinc-950 flex-col justify-between p-12 relative overflow-hidden">
                {/* Abstract Background Element */}
                <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950 pointer-events-none"></div>

                <div className="relative z-10">
                    <Link href="/" className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 transition-transform hover:scale-105 w-fit">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        CodeAtlas
                    </Link>
                </div>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        {title}
                    </h2>
                    <p className="text-lg text-zinc-400">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Right Panel - Form (Children) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}