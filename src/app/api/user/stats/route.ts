import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { redis, CACHE_TTL } from "@/app/lib/redis";

import { fetchLeetCodeUserInfo } from "@/app/lib/services/leetcode";
import { fetchCodeChefUserInfo } from "@/app/lib/services/codechef";
import { fetchCodeforcesUserInfo } from "@/app/lib/services/codeforces";
import { fetchGitHubUserInfo } from "@/app/lib/services/github";
import { fetchAtCoderUserInfo } from "@/app/lib/services/atcoder";
import { fetchGFGUserInfo } from "@/app/lib/services/gfg";
import { fetchInterviewBitUserInfo } from "@/app/lib/services/interviewbit";

type CodingStats =
    | Awaited<ReturnType<typeof fetchLeetCodeUserInfo>>
    | Awaited<ReturnType<typeof fetchCodeChefUserInfo>>
    | Awaited<ReturnType<typeof fetchCodeforcesUserInfo>>
    | Awaited<ReturnType<typeof fetchAtCoderUserInfo>>
    | Awaited<ReturnType<typeof fetchGFGUserInfo>>
    | Awaited<ReturnType<typeof fetchInterviewBitUserInfo>>;

type GitHubStats = Awaited<ReturnType<typeof fetchGitHubUserInfo>>;

export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Verify user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access"
            }, { status: 401 });
        }

        // 2. Check Redis Cache
        const cacheKey = `user:stats:${user.id}`;
        try {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                return NextResponse.json({
                    success: true,
                    isCached: true,
                    data: cachedData
                }, { status: 200 });
            }
        } catch (cacheErr) {
            // Log error but fallback to normal fetching if Redis fails
            console.error("Redis Read Error:", cacheErr);
        }

        // 3. Fetch user saved handles from Supabase on cache miss
        const { data: handles, error: handlesError } = await supabase
            .from("platform_handles")
            .select("platform_name, handle")
            .eq("user_id", user.id);

        if (handlesError) throw handlesError;

        if (!handles || handles.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No handles connected yet",
                data: { coding: [], github: null, totalSolved: 0 }
            }, { status: 200 });
        }

        // Process each handle using promises concurrently
        const codingStats: CodingStats[] = [];
        let githubStats: GitHubStats | null = null;
        let totalSolved = 0;

        const fetchPromises = handles.map(async (platform) => {
            const { platform_name, handle } = platform;

            try {
                if (platform_name === "leetcode") {
                    const data = await fetchLeetCodeUserInfo(handle);
                    if (data.success) {
                        totalSolved += data.totalSolved || 0;
                        codingStats.push(data);
                    }
                }
                else if (platform_name === "codeforces") {
                    const data = await fetchCodeforcesUserInfo(handle);
                    if (data.success) {
                        totalSolved += data.totalSolved || 0;
                        codingStats.push(data);
                    }
                }
                else if (platform_name === "codechef") {
                    const data = await fetchCodeChefUserInfo(handle);
                    if (data.success) {
                        totalSolved += data.totalSolved || 0;
                        codingStats.push(data);
                    }
                }
                else if (platform_name === "atcoder") {
                    const data = await fetchAtCoderUserInfo(handle);
                    if (data.success) {
                        codingStats.push(data);
                    }
                }
                else if (platform_name === "gfg") {
                    const data = await fetchGFGUserInfo(handle);
                    if (data.success) {
                        totalSolved += data.totalSolved || 0;
                        codingStats.push(data);
                    }
                }
                else if (platform_name === "interviewbit") {
                    const data = await fetchInterviewBitUserInfo(handle);
                    if (data.success) {
                        codingStats.push(data);
                    }
                }
                else if (platform_name === "github") {
                    const data = await fetchGitHubUserInfo(handle);
                    if (data.success) {
                        githubStats = data;
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch stats for ${platform_name}:`, error);
                codingStats.push({
                    success: false,
                    platform: platform_name,
                    error: "Data temporarily unavailable"
                });
            }
        });

        // Wait for all concurrent fetches to resolve
        await Promise.all(fetchPromises);

        const aggregatedData = {
            coding: codingStats,
            github: githubStats,
            totalSolved: totalSolved
        };

        // 4. Update Redis Cache with fresh aggregated data
        try {
            await redis.set(cacheKey, JSON.stringify(aggregatedData), {
                ex: CACHE_TTL.USER_STATS
            });
        } catch (cacheErr) {
            console.error("Redis Write Error:", cacheErr);
        }

        // Return the fresh aggregated data
        return NextResponse.json({
            success: true,
            isCached: false,
            data: aggregatedData
        }, { status: 200 });

    } catch (error) {
        console.error("Aggregation API Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to aggregate stats" },
            { status: 500 }
        );
    }
}