import { redirect } from "next/navigation";
import { getMember, nextSignupStep } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthCard, NotConfigured } from "@/components/ui";
import VerifyPhoneForm from "./VerifyPhoneForm";

export const metadata = { title: "Verify your phone · Holiday Swap" };

export default async function VerifyPhonePage() {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const member = await getMember();
  if (!member) redirect("/login");
  const step = nextSignupStep(member);
  if (step !== "/verify-phone") redirect(step ?? "/");

  return (
    <AuthCard
      title="Verify your phone"
      subtitle="We'll text you a 6-digit code. This is how neighbors know you're a real person. Your number is never shown to anyone."
    >
      <VerifyPhoneForm />
    </AuthCard>
  );
}
