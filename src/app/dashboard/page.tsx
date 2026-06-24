import { redirect } from "next/navigation";

import { createClient } from "@/app/lib/supabase/server";
import { ensureUserProfile } from "@/app/lib/user-profile";
import { getUserProfileByUserId } from "@/app/lib/user-stats";
import SalesDashboardDemo from "@/components/ui/demo";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const profile = (await getUserProfileByUserId(user.id)) ?? (await ensureUserProfile(user));

  if (profile?.username) {
    redirect(`/u/${encodeURIComponent(profile.username)}`);
  }

  return <SalesDashboardDemo />;
}
