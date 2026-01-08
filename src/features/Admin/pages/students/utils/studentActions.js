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

export const fetchStudentsData = async () => {
  const { data: studentsData } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, created_at, student_courses(course_id, course_name, progress)"
    )
    .eq("role", "student");

  const { data: coursesData } = await supabase
    .from("courses")
    .select("id, name");

  return {
    students: studentsData || [],
    courses: coursesData || [],
  };
};

export const addStudent = async (name, email, courseIds, courses) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: "default123",
  });

  if (error) throw new Error(error.message);

  const userId = data.user.id;

  await supabase.from("profiles").insert({
    id: userId,
    full_name: name,
    email,
    role: "student",
  });

  if (courseIds.length) {
    const mappedCourses = courseIds.map((cid) => {
      const course = courses.find((c) => c.id === cid);

      return {
        student_id: userId,
        course_id: cid,
        course_name: course?.name || "",
        progress: 0,
      };
    });

    const { error: courseError } = await supabase
      .from("student_courses")
      .insert(mappedCourses);

    if (courseError) {
      throw new Error("Failed to assign courses");
    }
  }

  await logActivity(`You Added new student "${name}"`);

  return userId;
};

export const updateStudent = async (studentId, name, courseIds, courses) => {
  await supabase
    .from("profiles")
    .update({ full_name: name })
    .eq("id", studentId);

  await supabase.from("student_courses").delete().eq("student_id", studentId);

  if (courseIds.length) {
    const mappedCourses = courseIds.map((cid) => {
      const course = courses.find((c) => c.id === cid);

      return {
        student_id: studentId,
        course_id: cid,
        course_name: course?.name || "",
        progress: 0,
      };
    });

    await supabase.from("student_courses").insert(mappedCourses);
  }

  await logActivity(`You Edited student "${name}"`);
};

export const deleteStudent = async (studentId, studentName) => {
  await supabase.from("student_courses").delete().eq("student_id", studentId);

  await supabase.from("profiles").delete().eq("id", studentId);

  await logActivity(`You Deleted "${studentName}" from the students`);
};
