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

        // Process each handle cleanly without side-effect mutations
        const fetchPromises = handles.map(async (platform) => {
            const { platform_name, handle } = platform;

            try {
                if (platform_name === "leetcode") {
                    const data = await fetchLeetCodeUserInfo(handle);
                    return { type: "coding", data };
                }
                if (platform_name === "codeforces") {
                    const data = await fetchCodeforcesUserInfo(handle);
                    return { type: "coding", data };
                }
                if (platform_name === "codechef") {
                    const data = await fetchCodeChefUserInfo(handle);
                    return { type: "coding", data };
                }
                if (platform_name === "atcoder") {
                    const data = await fetchAtCoderUserInfo(handle);
                    return { type: "coding", data };
                }
                if (platform_name === "gfg") {
                    const data = await fetchGFGUserInfo(handle);
                    return { type: "coding", data };
                }
                if (platform_name === "interviewbit") {
                    const data = await fetchInterviewBitUserInfo(handle);
                    return { type: "coding", data };
                }
                if (platform_name === "github") {
                    const data = await fetchGitHubUserInfo(handle);
                    return { type: "github", data };
                }
                return null;
            } catch (error) {
                console.error(`Failed to fetch stats for ${platform_name}:`, error);
                return {
                    type: "coding",
                    data: {
                        success: false,
                        platform: platform_name,
                        error: "Data temporarily unavailable"
                    }
                };
            }
        });

        // Wait for all concurrent fetches safely
        const results = await Promise.all(fetchPromises);

        const codingStats: CodingStats[] = [];
        let githubStats: GitHubStats | null = null;
        let totalSolved = 0;

        // 4. Aggregate cleanly on a single synchronous thread loop
        for (const item of results) {
            if (!item) continue;

            if (item.type === "github" && item.data?.success) {
                githubStats = item.data as GitHubStats;
            } else if (item.type === "coding") {
                const codingData = item.data as CodingStats;
                codingStats.push(codingData);

                if (codingData.success && "totalSolved" in codingData) {
                    totalSolved += codingData.totalSolved || 0;
                }
            }
        }

        const aggregatedData = {
            coding: codingStats,
            github: githubStats,
            totalSolved: totalSolved
        };

        // 5. Update Redis Cache
        try {
            await redis.set(cacheKey, JSON.stringify(aggregatedData), {
                ex: CACHE_TTL.USER_STATS
            });
        } catch (cacheErr) {
            console.error("Redis Write Error:", cacheErr);
        }

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