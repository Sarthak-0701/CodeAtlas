import { NextResponse } from "next/server";

import { createClient } from "@/app/lib/supabase/server";
import { getAggregatedUserStats } from "@/app/lib/user-stats";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 401 },
      );
    }

    const { data, isCached } = await getAggregatedUserStats(user.id, {
      includeProfile: true,
      cachePrefix: "user",
    });

    return NextResponse.json(
      {
        success: true,
        isCached,
        message: data.coding.length === 0 && !data.github ? "No handles connected yet" : undefined,
        data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Aggregation API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to aggregate stats" },
      { status: 500 },
    );
  }
}
