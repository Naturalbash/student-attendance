import supabase from "../../../../../utils/supabase";

export const fetchDashboardData = async () => {
  const today = new Date().toISOString().split("T")[0];

  /* STUDENTS */
  const { data: students, count: studentCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact" })
    .eq("role", "student");

  /* COURSES */
  const { count: courseCount } = await supabase
    .from("courses")
    .select("id", { count: "exact", head: true });

  /* ATTENDANCE TODAY */
  const { data: attendanceToday } = await supabase
    .from("attendance")
    .select("status")
    .eq("attendance_date", today);

  const presentToday =
    attendanceToday?.filter((a) => a.status === "present").length || 0;

  const absentToday =
    attendanceToday?.filter((a) => a.status === "absent").length || 0;

  /* UNASSIGNED STUDENTS */
  const { data: assigned } = await supabase
    .from("student_courses")
    .select("student_id");

  const assignedIds = new Set(assigned?.map((a) => a.student_id));
  const unassignedCount =
    students?.filter((s) => !assignedIds.has(s.id)).length || 0;

  /* ACTIVITY LOGS */
  const { data: recentActivities } = await supabase
    .from("activity_logs")
    .select("id, user_name, action, created_at")
    .order("created_at", { ascending: false })
    .limit(6);

  /* LAST ATTENDANCE FROM LOG */
  const lastAttendanceLog = recentActivities?.find((a) =>
    a.action.toLowerCase().includes("attendance")
  );

  const attendanceMarkedToday =
    lastAttendanceLog &&
    new Date(lastAttendanceLog.created_at).toISOString().split("T")[0] ===
      today;

  const stats = {
    students: studentCount || 0,
    present: presentToday,
    absent: absentToday,
    courses: courseCount || 0,
  };

  const systemStatus = [
    attendanceMarkedToday
      ? "Attendance marked today"
      : "Attendance not marked today",
    `${unassignedCount} students not assigned to any course`,
    lastAttendanceLog
      ? `Last attendance marked at ${new Date(
          lastAttendanceLog.created_at
        ).toLocaleTimeString()}`
      : "No attendance has been marked yet",
  ];

  const activities = recentActivities || [];

  return { stats, activities, systemStatus };
};
