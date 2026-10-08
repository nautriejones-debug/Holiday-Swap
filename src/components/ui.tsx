import Link from "next/link";

// Shared building blocks so every form looks the same and is easy to tap on a phone.
// Inputs use 16px text so iPhones don't zoom in when you tap them.

export const inputClass =
  "mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-3 text-base shadow-sm focus:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-700/30";

export const buttonClass =
  "inline-flex w-full items-center justify-center rounded-lg bg-red-700 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButtonClass =
  "inline-flex w-full items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-3 text-base font-semibold text-stone-800 hover:bg-stone-50 disabled:opacity-60";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
      {subtitle && <p className="mt-2 text-stone-600">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </main>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-800">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-sm text-stone-500">{hint}</span>}
    </label>
  );
}

export function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
      {message}
    </p>
  );
}

export function SuccessMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-900">
      {message}
    </p>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-red-700 underline underline-offset-2">
      {children}
    </Link>
  );
}

export function NotConfigured() {
  return (
    <AuthCard title="Almost ready">
      <p className="text-stone-700">
        Accounts aren&apos;t switched on yet. The Supabase settings still need to be added in
        Vercel.
      </p>
    </AuthCard>
  );
}
