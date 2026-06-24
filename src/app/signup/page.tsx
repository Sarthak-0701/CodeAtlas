'use client';

import React, { useState, useRef } from 'react'; // 1. Added useRef
import Link from 'next/link';
import { createClient } from '../lib/supabase/client';
import AuthLayout from '@/components/AuthLayout';
import HCaptcha from '@hcaptcha/react-hcaptcha'; // 2. Import hCaptcha

export default function SignUpPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null); // 3. State for token
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const captchaRef = useRef<HCaptcha>(null); // 4. Ref to reset captcha
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 5. Enforce captcha selection
    if (!captchaToken) {
      setError('Please complete the Captcha verification.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          captchaToken, // 6. Send token to the API route
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setFormData({ username: '', email: '', password: '' });
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha(); // Reset the box widget
      } else {
        setError(data.message || 'Signup failed');
        captchaRef.current?.resetCaptcha(); // Reset captcha on server failure
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      captchaRef.current?.resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      const errorMessage =
        typeof err === 'string'
          ? err
          : err instanceof Error
            ? err.message
            : 'Failed to authenticate with Google.';
      setError(errorMessage);
    }
  };

  return (
    <AuthLayout
      title="Start building your developer portfolio today."
      subtitle="Track your progress across LeetCode, Codeforces, CodeChef, GFG, Interviewbit, AtCoder and GitHub. All in one place."
    >
      <div className="text-left">
        <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Create an account</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Join CodeAtlas to aggregate your coding stats.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          suppressHydrationWarning
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm text-sm font-medium text-black dark:text-white bg-white dark:bg-black hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span>Sign up with Google</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-black text-zinc-500">Or continue with email</span>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Username</label>
            <input
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-4 py-2.5 text-black dark:text-white"
              placeholder="dev_wizard"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email address</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-4 py-2.5 text-black dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-4 py-2.5 pr-10 text-black dark:text-white"
              placeholder="••••••••"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-zinc-400"
            >
              {/* Show/Hide SVG */}
            </button>
          </div>

          {/* 7. Inject hCaptcha Widget into DOM */}
          <div className="flex justify-center py-2">
            <HCaptcha
              ref={captchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
              onVerify={onCaptchaChange}
              onExpire={() => setCaptchaToken(null)}
            />
          </div>

          {error && <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm">{error}</div>}
          {success && <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm">{success}. Please check your inbox.</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-black dark:bg-white dark:text-black disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
          <Link href="/signin" className="font-semibold text-black dark:text-white hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
