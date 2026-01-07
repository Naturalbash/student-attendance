import supabase from "./supabase";

export const ensureStudentData = async (user) => {
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || "Student",
      email: user.email,
      role: "student",
    });
  }
};
