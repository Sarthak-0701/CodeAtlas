import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createClient } from "@/app/lib/supabase/server";
import { getAggregatedUserStats, getUserProfileByUsername } from "@/app/lib/user-stats";
import { CodingDashboard } from "@/components/ui/live-coding-dashboard";

type PublicProfilePageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getUserProfileByUsername(username);

  if (!profile) {
    return {
      title: "Profile not found | CodeAtlas",
    };
  }

  return {
    title: `${profile.username} | CodeAtlas`,
    description: `Public coding profile for ${profile.username} on CodeAtlas.`,
    openGraph: {
      title: `${profile.username} | CodeAtlas`,
      description: `View ${profile.username}'s coding dashboard on CodeAtlas.`,
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const profile = await getUserProfileByUsername(username);

  if (!profile) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === profile.id;

  const { data } = await getAggregatedUserStats(profile.id, {
    includeProfile: true,
    cachePrefix: isOwner ? "user" : "public",
  });

  return <CodingDashboard initialStats={data} readOnly={!isOwner} />;
}
