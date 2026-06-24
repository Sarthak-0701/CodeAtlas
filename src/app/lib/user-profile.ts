import type { User } from "@supabase/supabase-js";

import { getSupabaseAdmin } from "@/app/lib/supabase/admin";

export type UserProfile = {
  id: string;
  username: string;
  email?: string | null;
};

export function getDefaultUsernameForUser(user: Pick<User, "email" | "user_metadata">) {
  const metadataUsername = user.user_metadata?.username;
  if (typeof metadataUsername === "string" && metadataUsername.trim()) {
    return metadataUsername.trim();
  }

  const emailUsername = user.email?.split("@")[0]?.trim();
  return emailUsername || null;
}

export async function ensureUserProfile(user: Pick<User, "id" | "email" | "user_metadata">): Promise<UserProfile | null> {
  const username = getDefaultUsernameForUser(user);
  if (!username) return null;

  const supabaseAdmin = getSupabaseAdmin();
  const { data: existingProfileById, error: fetchError } = await supabaseAdmin
    .from("users")
    .select("id, username, email")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    console.error("Fetch user profile error:", fetchError.message);
    return null;
  }

  let existingProfile = existingProfileById;

  if (!existingProfile && user.email) {
    const { data: existingProfileByEmail, error: emailFetchError } = await supabaseAdmin
      .from("users")
      .select("id, username, email")
      .eq("email", user.email)
      .maybeSingle();

    if (emailFetchError) {
      console.error("Fetch user profile by email error:", emailFetchError.message);
      return null;
    }

    existingProfile = existingProfileByEmail;
  }

  if (existingProfile?.username) {
    if (existingProfile.id !== user.id) {
      const { data: relinkedProfile, error: relinkError } = await supabaseAdmin
        .from("users")
        .update({
          id: user.id,
          email: existingProfile.email ?? user.email ?? null,
        })
        .eq("id", existingProfile.id)
        .select("id, username, email")
        .single();

      if (relinkError) {
        console.error("Relink user profile error:", relinkError.message);
        return existingProfile;
      }

      return relinkedProfile;
    }

    return existingProfile;
  }

  if (existingProfile) {
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        id: user.id,
        username,
        email: existingProfile.email ?? user.email ?? null,
      })
      .eq("id", existingProfile.id)
      .select("id, username, email")
      .single();

    if (updateError) {
      console.error("Update user profile error:", updateError.message);
      return null;
    }

    return updatedProfile;
  }

  const { data: createdProfile, error: insertError } = await supabaseAdmin
    .from("users")
    .insert({
      id: user.id,
      email: user.email ?? null,
      username,
    })
    .select("id, username, email")
    .single();

  if (insertError) {
    console.error("Create user profile error:", insertError.message);
    return null;
  }

  return createdProfile;
}
