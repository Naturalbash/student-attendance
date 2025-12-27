import supabase from "./supabase";

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
