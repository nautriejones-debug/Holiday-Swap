import { redirect } from "next/navigation";
import { getMember, nextSignupStep } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthCard, NotConfigured } from "@/components/ui";
import AgreeButton from "./AgreeButton";

export const metadata = { title: "Community guidelines · Holiday Swap" };

// Draft guidelines and safety tips. Step 9 of the build plan will polish these.
const GUIDELINES = [
  "Be kind and honest. Describe items accurately, including any wear or missing pieces.",
  "Only sell holiday decor you own. No new retail items for resale, no counterfeits, nothing unsafe.",
  "Keep conversations in the app. Don't ask for or share phone numbers, emails, or home addresses.",
  "Show up when you say you will. If plans change, message the other person right away.",
  "Report anything that feels off. We review every report.",
];

const SAFETY_TIPS = [
  "Meet in a public place: a police department safe exchange spot, a busy store parking lot, or a library.",
  "Meet in daylight, and bring a friend if you can.",
  "Pay at pickup, never in advance. Don't send deposits or use gift cards.",
  "Look the item over before you pay.",
  "Trust your gut. It's always OK to walk away.",
];

export default async function WelcomePage() {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const member = await getMember();
  if (!member) redirect("/login");
  const step = nextSignupStep(member);
  if (step !== "/welcome") redirect(step ?? "/");

  return (
    <AuthCard
      title={`Welcome, ${member.profile?.first_name || "neighbor"}!`}
      subtitle="Your phone is verified. One last thing: please read how we keep Holiday Swap friendly and safe."
    >
      <section>
        <h2 className="text-lg font-semibold text-stone-900">Community guidelines</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-stone-700">
          {GUIDELINES.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </section>
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-stone-900">Safety tips</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-stone-700">
          {SAFETY_TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
      <div className="mt-8">
        <AgreeButton userId={member.user.id} />
      </div>
    </AuthCard>
  );
}
