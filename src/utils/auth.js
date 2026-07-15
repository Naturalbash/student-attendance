import supabase from "./supabase";

export function getFriendlyAuthError(
  error,
  fallback = "We couldn’t complete that request right now. Please try again.",
) {
  const message = (error?.message || "").toLowerCase();
  const code = (error?.code || "").toLowerCase();

  if (!message && !code) return fallback;

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials") ||
    message.includes("invalid_grant")
  ) {
    return "We couldn’t sign you in. Please check your email and password and try again.";
  }

  if (
    message.includes("email not confirmed") ||
    message.includes("confirm your email") ||
    message.includes("not confirmed")
  ) {
    return "Please confirm your email address before signing in.";
  }

  if (
    message.includes("user not found") ||
    message.includes("no user found") ||
    message.includes("no account")
  ) {
    return "We couldn’t find an account for that email address.";
  }

  if (
    message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("user already")
  ) {
    return "An account with this email already exists. Please sign in instead.";
  }

  if (
    message.includes("password") &&
    (message.includes("weak") || message.includes("length"))
  ) {
    return "Please choose a password with at least 6 characters.";
  }

  if (
    message.includes("too many") ||
    message.includes("rate limit") ||
    message.includes("retry")
  ) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (
    message.includes("fetch failed") ||
    message.includes("network") ||
    message.includes("timeout")
  ) {
    return "We couldn’t reach the server. Please check your connection and try again.";
  }

  if (message.includes("reset password") || message.includes("reset email")) {
    return "We couldn’t send the reset link right now. Please try again in a moment.";
  }

  return fallback;
}

export async function ensureProfileExists(user) {
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (profile) return profile;

  if (error && error.code !== "PGRST116") {
    console.error("Profile fetch error:", error);
    throw error;
  }

  // Create profile
  const { data: newProfile, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || "",
      role: user.user_metadata?.role || "student",
    })
    .select()
    .single();

  if (insertError) {
    console.error("Profile creation failed:", insertError);
    throw insertError;
  }

  return newProfile;
}

// Helper function
export default async function signUpAndCreateProfile({
  email,
  password,
  full_name,
  role,
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role,
      },
    },
  });

  if (error) return { error };

  // If email confirmation is ON, user is null
  return {
    user: data.user ?? null,
    needsConfirmation: !data.user,
    error: null,
  };
}
