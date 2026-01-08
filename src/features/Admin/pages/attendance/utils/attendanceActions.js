import supabase from "../../../../../utils/supabase";

export const logActivity = async (action) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    user_name: user.email,
    action,
  });
};

export const fetchAttendanceData = async (date) => {
  const { data: studentsData } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "student");

  const { data: coursesData } = await supabase
    .from("courses")
    .select("id, name");

  const { data: attendanceData } = await supabase
    .from("attendance")
    .select("student_id, status")
    .eq("attendance_date", date);

  const initialAttendance = {};

  attendanceData?.forEach((a) => {
    initialAttendance[a.student_id] = a.status;
  });

  studentsData?.forEach((s) => {
    if (!initialAttendance[s.id]) {
      initialAttendance[s.id] = "present";
    }
  });

  return {
    students: studentsData || [],
    courses: coursesData || [],
    attendance: initialAttendance,
  };
};

export const saveAttendance = async (students, attendance, date) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const records = students.map((student) => ({
    student_id: student.id,
    attendance_date: date,
    status: attendance[student.id],
    marked_by: user?.id || null,
  }));

  const { error } = await supabase.from("attendance").upsert(records, {
    onConflict: ["student_id", "attendance_date"],
  });

  if (error) throw error;

  await logActivity("Marked daily attendance");
};

export const assignStudent = async (
  studentId,
  courseId,
  courseName,
  studentName
) => {
  const { data: existing } = await supabase
    .from("student_courses")
    .select("*")
    .eq("student_id", studentId)
    .eq("course_id", courseId);

  if (existing?.length) {
    throw new Error(`${studentName} is already assigned to ${courseName}`);
  }

  const { error } = await supabase.from("student_courses").insert({
    student_id: studentId,
    course_id: courseId,
    course_name: courseName,
    progress: 0,
  });

  if (error) throw error;

  await logActivity(`Assigned ${studentName} to ${courseName}`);
};
