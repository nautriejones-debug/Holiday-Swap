import { redirect } from "next/navigation";
import { getMember, nextSignupStep } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthCard, NotConfigured, TextLink } from "@/components/ui";
import LoginForm from "./LoginForm";

export const metadata = { title: "Log in · Holiday Swap" };

export default async function LoginPage() {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const member = await getMember();
  if (member) redirect(nextSignupStep(member) ?? "/");

  return (
    <AuthCard
      title="Welcome back"
      subtitle={
        <>
          New here? <TextLink href="/signup">Create an account</TextLink>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
