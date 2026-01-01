import supabase from "./supabase";

export async function getStudentDashboardData(userId) {
  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  if (profileError) throw profileError;

  // Fetch recent attendance (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: attendance, error: attendanceError } = await supabase
    .from("attendance")
    .select("date, present")
    .eq("student_id", userId)
    .gte("date", thirtyDaysAgo.toISOString().split("T")[0])
    .order("date", { ascending: false });

  if (attendanceError) throw attendanceError;

  // Fetch recent activities (last 10)
  const { data: activities, error: activitiesError } = await supabase
    .from("activities")
    .select("action, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (activitiesError) throw activitiesError;

  // Fetch enrolled courses
  const { data: courses, error: coursesError } = await supabase
    .from("student_courses")
    .select("courses(name, completed)")
    .eq("student_id", userId);

  if (coursesError) throw coursesError;

  const formattedCourses = courses.map((sc) => sc.courses);

  return {
    profile,
    attendance: attendance || [],
    activities: activities || [],
    courses: formattedCourses || [],
  };
}
