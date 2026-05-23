import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        // 1. Destructure captchaToken from the request body
        const { email, password, captchaToken } = body;

        if (!email || !password || !captchaToken) {
            return NextResponse.json(
                { success: false, message: "Invalid parameters. Verification missing." },
                { status: 400 }
            );
        }

        // 2. Pass the captchaToken in the options object
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
            options: {
                captchaToken: captchaToken,
            }
        });

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Login successful" },
            { status: 200 }
        );
    } catch (error) {
        console.log("Signin error", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { success: false, message: "Signin failed", errorDetail: errorMessage },
            { status: 500 }
        );
    }
}