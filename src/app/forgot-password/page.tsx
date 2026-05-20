'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.message || 'Failed to send reset link.');
                return;
            }

            setSuccess(data.message);
        } catch {
            setError('Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset your password."
            subtitle="Don't worry, it happens to the best of us. We'll get you back into CodeAtlas."
        >
            <div className="text-left">
                <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Forgot Password</h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Enter the email associated with your account and we&apos;ll send you a link to reset your password.
                </p>
            </div>

            <div className="mt-8 space-y-6">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-4 py-2.5 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm border border-red-200 dark:border-red-800/50">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md text-sm border border-green-200 dark:border-green-800/50">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !!success}
                        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70"
                    >
                        {loading ? 'Sending link...' : 'Send reset link'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Remember your password?{' '}
                    <Link href="/signin" className="font-semibold text-black dark:text-white hover:underline">
                        Back to log in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
