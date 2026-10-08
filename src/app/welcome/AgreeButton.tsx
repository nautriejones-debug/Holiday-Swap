"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import { buttonClass, ErrorMessage } from "@/components/ui";

export default function AgreeButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onAgree() {
    setError(null);
    setBusy(true);
    const { error } = await createClient()
      .from("profiles")
      .update({ guidelines_accepted_at: new Date().toISOString() })
      .eq("id", userId);
    setBusy(false);
    if (error) {
      setError(friendlyError(error.message));
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <label className="flex items-start gap-3 text-stone-800">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-1 h-5 w-5 accent-red-700"
        />
        <span>I agree to the community guidelines and will follow the safety tips.</span>
      </label>
      <ErrorMessage message={error} />
      <button onClick={onAgree} disabled={!checked || busy} className={buttonClass}>
        {busy ? "Saving…" : "Let's go"}
      </button>
    </div>
  );
}
