import supabase from "../../../../../utils/supabase";

export const getCurrentStudent = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

export const fetchDailyAttendance = async (studentId, date) => {
  const { data } = await supabase
    .from("attendance")
    .select("id, attendance_date, status, marked_by")
    .eq("student_id", studentId)
    .eq("attendance_date", date)
    .maybeSingle();

  return data || null;
};

export const fetchMonthlyAttendance = async (studentId, month) => {
  const start = `${month}-01`;
  const end = `${month}-31`;

  const { data } = await supabase
    .from("attendance")
    .select("id, attendance_date, status")
    .eq("student_id", studentId)
    .gte("attendance_date", start)
    .lte("attendance_date", end);

  return data || [];
};

export const subscribeToAttendanceChanges = (
  studentId,
  date,
  month,
  onChange
) => {
  const channel = supabase
    .channel("student-attendance-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "attendance",
        filter: `student_id=eq.${studentId}`,
      },
      (payload) => {
        const record = payload.new || payload.old;
        if (!record) return;

        onChange(payload, record);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};
