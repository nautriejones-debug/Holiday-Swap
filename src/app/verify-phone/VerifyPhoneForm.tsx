"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import { formatUsPhone, toUsE164 } from "@/lib/phone";
import {
  buttonClass,
  ErrorMessage,
  Field,
  inputClass,
  secondaryButtonClass,
  SuccessMessage,
} from "@/components/ui";

export default function VerifyPhoneForm() {
  const router = useRouter();
  const [phone, setPhone] = useState<string | null>(null); // set once a code is sent
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendCode(e164: string) {
    setError(null);
    setNotice(null);
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ phone: e164 });
    setBusy(false);
    if (error) {
      setError(friendlyError(error.message));
      return false;
    }
    return true;
  }

  async function onSendCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const e164 = toUsE164(String(new FormData(e.currentTarget).get("phone")));
    if (!e164) {
      setError("Please enter a 10-digit US phone number.");
      return;
    }
    if (await sendCode(e164)) setPhone(e164);
  }

  async function onVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!phone) return;
    setError(null);
    setBusy(true);
    const token = String(new FormData(e.currentTarget).get("code")).replace(/\D/g, "");
    const { error } = await createClient().auth.verifyOtp({
      phone,
      token,
      type: "phone_change",
    });
    setBusy(false);
    if (error) {
      setError(friendlyError(error.message));
      return;
    }
    router.push("/welcome");
    router.refresh();
  }

  if (!phone) {
    return (
      <form onSubmit={onSendCode} className="space-y-4">
        <Field label="Mobile phone number" hint="US numbers only. Message and data rates may apply.">
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel-national"
            placeholder="(770) 555-1234"
            className={inputClass}
          />
        </Field>
        <ErrorMessage message={error} />
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Sending…" : "Text me a code"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onVerify} className="space-y-4">
      <p className="text-stone-700">
        We sent a code to <strong>{formatUsPhone(phone)}</strong>.
      </p>
      <Field label="6-digit code">
        <input
          name="code"
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]{6,8}"
          maxLength={8}
          className={`${inputClass} tracking-widest`}
        />
      </Field>
      <ErrorMessage message={error} />
      <SuccessMessage message={notice} />
      <button type="submit" disabled={busy} className={buttonClass}>
        {busy ? "Checking…" : "Verify"}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={busy}
          className={secondaryButtonClass}
          onClick={async () => {
            if (await sendCode(phone)) setNotice("We sent a new code.");
          }}
        >
          Resend code
        </button>
        <button
          type="button"
          disabled={busy}
          className={secondaryButtonClass}
          onClick={() => {
            setPhone(null);
            setError(null);
            setNotice(null);
          }}
        >
          Change number
        </button>
      </div>
    </form>
  );
}
