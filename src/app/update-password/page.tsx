'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/client';
import AuthLayout from '@/components/AuthLayout';

const PASSWORD_RULES = [
    {
        label: 'At least 8 characters',
        test: (password: string) => password.length >= 8,
    },
    {
        label: 'One uppercase letter',
        test: (password: string) => /[A-Z]/.test(password),
    },
    {
        label: 'One lowercase letter',
        test: (password: string) => /[a-z]/.test(password),
    },
    {
        label: 'One number',
        test: (password: string) => /[0-9]/.test(password),
    },
    {
        label: 'One special character',
        test: (password: string) => /[^A-Za-z0-9]/.test(password),
    },
];

export default function UpdatePasswordPage() {
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        supabase.auth.getUser().then(({ data }) => {
            if (!isMounted) {
                return;
            }

            if (!data.user) {
                setError('Reset link is invalid or expired. Request a new password reset email.');
            }

            setCheckingSession(false);
        });

        return () => {
            isMounted = false;
        };
    }, [supabase]);

    const passwordErrors = PASSWORD_RULES
        .filter((rule) => !rule.test(password))
        .map((rule) => rule.label);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (passwordErrors.length > 0) {
            setError('Please choose a stronger password.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, confirmPassword }),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.message || 'Failed to update password.');
                return;
            }

            router.replace('/signin?message=password-updated');
        } catch {
            setError('Failed to update password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Secure your account."
            subtitle="Enter a new, strong password to get back to tracking your coding journey."
        >
            <div className="text-left">
                <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Set new password</h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Please enter your new password below.
                </p>
            </div>

            <div className="mt-8 space-y-6">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">New password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={8}
                            maxLength={72}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-4 py-2.5 pr-10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
                            placeholder="********"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[34px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Confirm password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={8}
                            maxLength={72}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-4 py-2.5 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
                            placeholder="********"
                            autoComplete="new-password"
                        />
                    </div>

                    <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {PASSWORD_RULES.map((rule) => {
                            const passed = rule.test(password);
                            return (
                                <li key={rule.label} className={passed ? 'text-green-700 dark:text-green-400' : undefined}>
                                    {passed ? 'OK' : '--'} {rule.label}
                                </li>
                            );
                        })}
                    </ul>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm border border-red-200 dark:border-red-800/50">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || checkingSession}
                        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70"
                    >
                        {loading ? 'Updating...' : checkingSession ? 'Checking reset link...' : 'Update password'}
                    </button>
                </form>

                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Need a new link?{' '}
                    <Link href="/forgot-password" className="font-semibold text-black dark:text-white hover:underline">
                        Request another reset email
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
