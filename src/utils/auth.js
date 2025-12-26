import supabase from "./supabase";

const signUpAndCreateProfile = async ({ name, email, password, role }) => {
  // 1️⃣ Sign up user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost:5173/auth/confirm-email",
      data: {
        role, // stored in auth metadata
      },
    },
  });

  if (error) throw error;

  const user = data.user;
  if (!user) return;

  // 2️⃣ Create profile row
  const { error: profileError } = await supabase.from("profiles").insert([
    {
      id: user.id,
      name,
      email, // IMPORTANT: prevents null email
      role,
    },
  ]);

  if (profileError) throw profileError;

  return data;
};

export default signUpAndCreateProfile;
