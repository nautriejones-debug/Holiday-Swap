"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import { buttonClass, ErrorMessage, Field, inputClass, TextLink } from "@/components/ui";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
    });
    setBusy(false);
    if (error) {
      setError(friendlyError(error.message));
      return;
    }
    // The home page sends members who haven't finished signing up to the right step.
    router.replace("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Email">
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </Field>
      <Field label="Password">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>
      <ErrorMessage message={error} />
      <button type="submit" disabled={busy} className={buttonClass}>
        {busy ? "Logging in…" : "Log in"}
      </button>
      <p className="text-center text-sm">
        <TextLink href="/forgot-password">Forgot your password?</TextLink>
      </p>
    </form>
  );
}
