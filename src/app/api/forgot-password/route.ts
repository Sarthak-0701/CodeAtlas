import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { redis } from '@/app/lib/redis';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60; // 15 minutes in seconds (Upstash uses seconds for EX expiration)
const RATE_LIMIT_MAX_REQUESTS = 5;

function normalizeEmail(email: unknown) {
    return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function getEmailFromPayload(payload: unknown) {
    if (!payload || typeof payload !== 'object') {
        return '';
    }

    return normalizeEmail((payload as { email?: unknown }).email);
}

function getClientIp(request: Request) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    return forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

async function isRateLimited(key: string): Promise<boolean> {
    const redisKey = `ratelimit:forgot-password:${key}`;

    try {
        // 1. Atomically increment the request count
        const currentCount = await redis.incr(redisKey);

        // 2. If it's the very first request in this window, establish the 15-minute TTL
        if (currentCount === 1) {
            await redis.expire(redisKey, RATE_LIMIT_WINDOW_SECONDS);
        }

        // 3. Enforce the max requests constraint
        return currentCount > RATE_LIMIT_MAX_REQUESTS;
    } catch (error) {
        // Fail-open strategy: Log Upstash errors but don't brick the login flow for users
        console.error('Redis rate limiting failed:', error);
        return false;
    }
}

function getAppOrigin(request: Request) {
    const configuredUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.SITE_URL;

    if (configuredUrl) {
        return new URL(configuredUrl).origin;
    }

    return new URL(request.url).origin;
}

function getGenericSuccessResponse() {
    return NextResponse.json({
        success: true,
        message: 'If an account exists for that email, a password reset link has been sent.',
    });
}

export async function POST(request: Request) {
    let payload: unknown;

    try {
        payload = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, message: 'Invalid request body.' },
            { status: 400 }
        );
    }

    const email = getEmailFromPayload(payload);

    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
        return NextResponse.json(
            { success: false, message: 'Enter a valid email address.' },
            { status: 400 }
        );
    }

    const rateLimitKey = `${getClientIp(request)}:${email}`;
    if (await isRateLimited(rateLimitKey)) {
        return NextResponse.json(
            { success: false, message: 'Too many reset attempts. Please try again later.' },
            { status: 429 }
        );
    }

    const appOrigin = getAppOrigin(request);
    const redirectUrl = new URL('/auth/callback', appOrigin);
    redirectUrl.searchParams.set('next', '/update-password');
    redirectUrl.searchParams.set('type', 'recovery');

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl.toString(),
    });

    if (error) {
        console.error('Password reset request failed:', error.message);
    }

    return getGenericSuccessResponse();
}
