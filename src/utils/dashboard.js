import supabase from "./supabase";

export const getStudentDashboardData = async (studentId) => {
  /* COURSES */
  const { data: courses } = await supabase
    .from("student_courses")
    .select("id, progress, course_id, courses(name)")
    .eq("student_id", studentId);

  /* PROJECTS */
  const { data: projects } = await supabase
    .from("student_projects")
    .select("id, progress")
    .eq("student_id", studentId);

  /* ATTENDANCE */
  const { data: attendance } = await supabase
    .from("attendance")
    .select("attendance_date, status")
    .eq("student_id", studentId)
    .order("attendance_date", { ascending: false })
    .limit(5);

  /* ACTIVITIES */
  const { data: activities } = await supabase
    .from("activity_logs")
    .select("id, action, created_at")
    .eq("user_id", studentId)
    .order("created_at", { ascending: false })
    .limit(6);

  return {
    courses: courses || [],
    projects: projects || [],
    attendance: attendance || [],
    activities: activities || [],
  };
};
