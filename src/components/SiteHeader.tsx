import Link from "next/link";
import { getMember } from "@/lib/auth";

export default async function SiteHeader() {
  const member = await getMember();

  return (
    <header className="border-b border-stone-200 bg-white/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-red-700">
          Holiday Swap
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {member ? (
            <>
              <span className="hidden text-stone-600 sm:inline">
                Hi, {member.profile?.first_name || "neighbor"}
              </span>
              <form action="/auth/signout" method="post">
                <button className="rounded-lg px-3 py-2 font-semibold text-stone-700 hover:bg-stone-100">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 font-semibold text-stone-700 hover:bg-stone-100">
                Log in
              </Link>
              <Link href="/signup" className="rounded-lg bg-red-700 px-3 py-2 font-semibold text-white hover:bg-red-800">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
