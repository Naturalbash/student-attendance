import supabase from "./supabase";

export const logActivity = async (action) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  //   Fetch profile name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    user_name: profile?.full_name || user.email,
    action,
  });
};
