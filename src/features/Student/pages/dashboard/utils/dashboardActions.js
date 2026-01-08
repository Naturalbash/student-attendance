import supabase from "../../../../../utils/supabase";
import { ensureStudentData } from "../../../../../utils/ensureStudentData";
import { getStudentDashboardData } from "../../../../../utils/dashboard";

export const loadStudentDashboard = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // ✅ ONLY ADDITION: set student name (safe fallback)
  const studentName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";

  await ensureStudentData(user);
  const dashboardData = await getStudentDashboardData(user.id);

  return {
    studentName,
    dashboardData,
  };
};

export const setupDashboardRealtime = (onUpdate) => {
  const channel = supabase
    .channel("student-dashboard")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "activity_logs" },
      onUpdate
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "student_courses" },
      onUpdate
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "student_projects" },
      onUpdate
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};
