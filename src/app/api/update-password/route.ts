import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

const PASSWORD_RECOVERY_COOKIE = 'codeatlas-password-recovery';
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

function validatePassword(password: string) {
    if (password.length < PASSWORD_MIN_LENGTH) {
        return 'Password must be at least 8 characters long.';
    }

    if (password.length > PASSWORD_MAX_LENGTH) {
        return 'Password must be 72 characters or fewer.';
    }

    if (!/[a-z]/.test(password)) {
        return 'Password must include a lowercase letter.';
    }

    if (!/[A-Z]/.test(password)) {
        return 'Password must include an uppercase letter.';
    }

    if (!/[0-9]/.test(password)) {
        return 'Password must include a number.';
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        return 'Password must include a special character.';
    }

    return null;
}

function clearRecoveryCookie(response: NextResponse) {
    response.cookies.set(PASSWORD_RECOVERY_COOKIE, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
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

    const requestBody =
        payload && typeof payload === 'object'
            ? (payload as { password?: unknown; confirmPassword?: unknown })
            : {};

    const { password, confirmPassword } = requestBody;

    if (typeof password !== 'string' || typeof confirmPassword !== 'string') {
        return NextResponse.json(
            { success: false, message: 'Password and confirmation are required.' },
            { status: 400 }
        );
    }

    if (password !== confirmPassword) {
        return NextResponse.json(
            { success: false, message: 'Passwords do not match.' },
            { status: 400 }
        );
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return NextResponse.json(
            { success: false, message: passwordError },
            { status: 400 }
        );
    }

    const cookieStore = await cookies();
    const hasRecoveryCookie = cookieStore.get(PASSWORD_RECOVERY_COOKIE)?.value === '1';

    if (!hasRecoveryCookie) {
        return NextResponse.json(
            { success: false, message: 'Reset link is invalid or expired. Request a new password reset email.' },
            { status: 403 }
        );
    }

    const supabase = await createClient();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        const response = NextResponse.json(
            { success: false, message: 'Reset session is invalid or expired. Request a new password reset email.' },
            { status: 401 }
        );
        clearRecoveryCookie(response);
        return response;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return NextResponse.json(
            { success: false, message: 'Unable to update password. Request a new password reset email.' },
            { status: 400 }
        );
    }

    await supabase.auth.signOut({ scope: 'global' });

    const response = NextResponse.json({
        success: true,
        message: 'Password updated successfully. Please sign in with your new password.',
    });
    clearRecoveryCookie(response);
    return response;
}
