// Turns Supabase's technical error messages into plain language.
export function friendlyError(message: string | undefined): string {
  const m = (message ?? "").toLowerCase();
  if (m.includes("invalid login credentials"))
    return "That email and password don't match. Try again, or reset your password.";
  if (m.includes("user already registered") || (m.includes("already been registered") && m.includes("email")))
    return "There's already an account with that email. Try logging in instead.";
  if (m.includes("phone") && (m.includes("already") || m.includes("registered") || m.includes("exists")))
    return "That phone number is already used by another account.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email first. Check your inbox for a link.";
  if (m.includes("expired") || (m.includes("invalid") && m.includes("otp")))
    return "That code didn't work or has expired. Request a new one and try again.";
  if (m.includes("password") && (m.includes("at least") || m.includes("characters") || m.includes("weak")))
    return "Please choose a longer password (at least 8 characters).";
  if (m.includes("rate limit") || m.includes("too many") || m.includes("security purposes"))
    return "Too many tries in a short time. Please wait a minute and try again.";
  if (m.includes("sms") || m.includes("twilio") || m.includes("phone provider"))
    return "We couldn't send a text to that number. Check it and try again.";
  if (m.includes("fetch") || m.includes("network"))
    return "Couldn't reach the server. Check your connection and try again.";
  return message || "Something went wrong. Please try again.";
}
