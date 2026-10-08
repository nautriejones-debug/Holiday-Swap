import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

export type Profile = {
  id: string;
  first_name: string;
  city: string;
  phone_verified: boolean;
  guidelines_accepted_at: string | null;
};

export type Member = { user: User; profile: Profile | null };

// The signed-in member, or null if nobody is signed in.
export async function getMember(): Promise<Member | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, city, phone_verified, guidelines_accepted_at")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile };
}

// Where a member still needs to go to finish signing up, or null if they're done.
export function nextSignupStep(member: Member): string | null {
  if (!member.user.phone_confirmed_at || !member.user.phone) return "/verify-phone";
  if (!member.profile?.guidelines_accepted_at) return "/welcome";
  return null;
}

// Use at the top of any members-only page.
export async function requireMember(): Promise<Member> {
  const member = await getMember();
  if (!member) redirect("/login");
  const step = nextSignupStep(member);
  if (step) redirect(step);
  return member;
}
