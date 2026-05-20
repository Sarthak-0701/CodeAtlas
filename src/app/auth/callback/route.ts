import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

const PASSWORD_RECOVERY_COOKIE = 'codeatlas-password-recovery';

function getSafeNext(rawNext: string | null, fallback = '/dashboard') {
    if (!rawNext || !rawNext.startsWith('/') || rawNext.startsWith('//') || rawNext.includes('\\')) {
        return fallback;
    }

    return rawNext;
}

function getRedirectUrl(request: Request, origin: string, path: string) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const isLocalEnv = process.env.NODE_ENV === 'development';
    const baseUrl = !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin;

    return new URL(path, baseUrl);
}

export async function GET(request: Request) {
    // Get the url 
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = getSafeNext(searchParams.get('next'));
    const flowType = searchParams.get('type');
    const isPasswordRecovery = flowType === 'recovery' || next === '/update-password';

    //Handle cancellations and errors
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');

    if (error) {
        const errorMessage = error_description || 'Authentication was cancelled.';
        const redirectUrl = getRedirectUrl(request, origin, isPasswordRecovery ? '/forgot-password' : '/signin');
        redirectUrl.searchParams.set('error', errorMessage);
        return NextResponse.redirect(redirectUrl);
    }

    if (code) {
        const supabase = await createClient();

        // Exchange the auth code for a valid session
        const { data: authData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

        if (!sessionError && authData?.user) {
            const user = authData.user;

            if (!isPasswordRecovery) {
                //Generate the default username
                let username = user.user_metadata?.username;
                if (!username && user.email) {
                    username = user.email.split('@')[0];
                    await supabase.auth.updateUser({
                        data: { username: username }
                    });
                }

                // Check for user already exists or not in table
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('id')
                    .eq('id', user.id)
                    .single();

                // If they don't exist, insert them!
                if (!existingUser) {
                    await supabase
                        .from('users')
                        .insert([
                            {
                                id: user.id, // Link it to the Supabase Auth ID
                                email: user.email,
                                username: username, // default username given 
                            }
                        ]);
                }
            }

            const redirectUrl = getRedirectUrl(request, origin, isPasswordRecovery ? '/update-password' : next);
            const response = NextResponse.redirect(redirectUrl);

            if (isPasswordRecovery) {
                response.cookies.set(PASSWORD_RECOVERY_COOKIE, '1', {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 10 * 60,
                });
            }

            return response;
        } else {
            console.error("Auth Callback Error:", sessionError?.message);
            const redirectUrl = getRedirectUrl(request, origin, isPasswordRecovery ? '/forgot-password' : '/signin');
            redirectUrl.searchParams.set('error', sessionError?.message || 'Authentication failed');
            return NextResponse.redirect(redirectUrl);
        }
    }

    const redirectUrl = getRedirectUrl(request, origin, isPasswordRecovery ? '/forgot-password' : '/signin');
    redirectUrl.searchParams.set('error', 'Could not authenticate');
    return NextResponse.redirect(redirectUrl);
}
