import { redirect } from "next/navigation";
import { getMember, nextSignupStep } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthCard, NotConfigured, TextLink } from "@/components/ui";
import SignupForm from "./SignupForm";

export const metadata = { title: "Sign up · Holiday Swap" };

export default async function SignupPage() {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const member = await getMember();
  if (member) redirect(nextSignupStep(member) ?? "/");

  return (
    <AuthCard
      title="Join Holiday Swap"
      subtitle={
        <>
          Already have an account? <TextLink href="/login">Log in</TextLink>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
