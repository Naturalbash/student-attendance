import supabase from "./supabase";

export async function ensureStudentData(userId) {
  // Check if student exists
  const { data: student, error: fetchError } = await supabase
    .from("students")
    .select("id")
    .eq("id", userId)
    .single();

  if (student) return; // Already exists

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  // Create student record
  const { error: insertError } = await supabase.from("students").insert({
    id: userId,
    enrolled_at: new Date().toISOString(),
  });

  if (insertError) throw insertError;
}
