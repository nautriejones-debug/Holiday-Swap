"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import {
  AuthCard,
  buttonClass,
  ErrorMessage,
  Field,
  inputClass,
  SuccessMessage,
  TextLink,
} from "@/components/ui";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setBusy(false);
    if (error) {
      setError(friendlyError(error.message));
      return;
    }
    setSent(true);
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle={
        <>
          Remembered it? <TextLink href="/login">Log in</TextLink>
        </>
      }
    >
      {sent ? (
        <SuccessMessage message="If there's an account with that email, we just sent a link to reset your password. Open it on this same phone or computer." />
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Email">
            <input name="email" type="email" required autoComplete="email" className={inputClass} />
          </Field>
          <ErrorMessage message={error} />
          <button type="submit" disabled={busy} className={buttonClass}>
            {busy ? "Sending…" : "Email me a reset link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
