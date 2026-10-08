"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import { AuthCard, buttonClass, ErrorMessage, Field, inputClass } from "@/components/ui";

// Members land here from the reset link in their email (already signed in by /auth/callback).
export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const password = String(new FormData(e.currentTarget).get("password"));
    if (password.length < 8) {
      setError("Please choose a password with at least 8 characters.");
      return;
    }
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError(
        error.message.toLowerCase().includes("session")
          ? "This reset link has expired. Please request a new one."
          : friendlyError(error.message),
      );
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <AuthCard title="Choose a new password">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="New password" hint="At least 8 characters.">
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
        </Field>
        <ErrorMessage message={error} />
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Saving…" : "Save new password"}
        </button>
      </form>
    </AuthCard>
  );
}
