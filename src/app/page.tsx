import Link from "next/link";
import { redirect } from "next/navigation";
import { getMember, nextSignupStep } from "@/lib/auth";

export default async function Home() {
  const member = await getMember();
  if (member) {
    // Send members who haven't finished signing up to their next step.
    const step = nextSignupStep(member);
    if (step) redirect(step);
  }

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center">
      <p className="text-5xl" aria-hidden="true">
        🎄🕎🕯️✨
      </p>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-red-700">Holiday Swap</h1>
      <p className="mt-4 text-lg">
        Decorate for less this year. Buy and sell used holiday decor with your neighbors in North
        Fulton.
      </p>

      {member ? (
        <div className="mt-8 w-full rounded-xl border border-stone-200 bg-white p-5 text-left">
          <p className="font-semibold text-stone-900">
            You&apos;re in, {member.profile?.first_name || "neighbor"}!{" "}
            {member.profile?.phone_verified && (
              <span className="ml-1 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-900">
                ✓ Verified
              </span>
            )}
          </p>
          <p className="mt-2 text-stone-600">
            Listings are coming soon. You&apos;ll be able to post and browse decor in{" "}
            {member.profile?.city || "North Fulton"} shortly.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <Link
            href="/signup"
            className="rounded-lg bg-red-700 px-4 py-3 font-semibold text-white hover:bg-red-800"
          >
            Create an account
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-800 hover:bg-stone-50"
          >
            Log in
          </Link>
        </div>
      )}
    </main>
  );
}
