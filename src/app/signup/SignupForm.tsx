"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CITIES } from "@/lib/cities";
import { friendlyError } from "@/lib/errors";
import { buttonClass, ErrorMessage, Field, inputClass, SuccessMessage } from "@/components/ui";

export default function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("first_name")).trim();
    const lastName = String(form.get("last_name")).trim();
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    const city = String(form.get("city"));

    if (password.length < 8) {
      setError("Please choose a password with at least 8 characters.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Last name stays private; only first name and city are shown to other members.
        data: { first_name: firstName, last_name: lastName, city },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/verify-phone`,
      },
    });
    setBusy(false);

    if (error) {
      setError(friendlyError(error.message));
      return;
    }
    if (!data.session) {
      // Only happens if "Confirm email" is turned on in Supabase.
      setNotice("Check your email for a link to confirm your account, then come back to finish.");
      return;
    }
    router.push("/verify-phone");
    router.refresh();
  }

  if (notice) return <SuccessMessage message={notice} />;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name">
          <input name="first_name" required autoComplete="given-name" className={inputClass} />
        </Field>
        <Field label="Last name">
          <input name="last_name" required autoComplete="family-name" className={inputClass} />
        </Field>
      </div>
      <p className="-mt-2 text-sm text-stone-500">
        Other members only see your first name.
      </p>
      <Field label="Email">
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </Field>
      <Field label="Password" hint="At least 8 characters.">
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>
      <Field label="City" hint="Holiday Swap is open to North Fulton during the beta.">
        <select name="city" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Choose your city
          </option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <ErrorMessage message={error} />
      <button type="submit" disabled={busy} className={buttonClass}>
        {busy ? "Creating your account…" : "Continue"}
      </button>
      <p className="text-center text-sm text-stone-500">
        Next, we&apos;ll text you a code to verify your phone.
      </p>
    </form>
  );
}
