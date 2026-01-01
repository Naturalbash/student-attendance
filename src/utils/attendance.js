import supabase from "./supabase";

export async function getStudentAttendance(userId, date) {
  // Fetch attendance for the specific date
  const { data: attendance, error } = await supabase
    .from("attendance")
    .select("courses(name), attendance")
    .eq("student_id", userId)
    .eq("date", date);

  if (error) throw error;

  // Format the data
  const formattedAttendance = attendance.map((a) => ({
    course: a.courses.name,
    attendance: a.attendance, // "present" or "absent"
  }));

  return formattedAttendance;
}
