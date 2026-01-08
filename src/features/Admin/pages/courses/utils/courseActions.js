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

export const fetchCourses = async () => {
  const { data: coursesData, error } = await supabase
    .from("courses")
    .select("id, name, description, created_at");

  if (error) throw error;

  // Get student counts for all courses in a single query
  const { data: studentCounts, error: countError } = await supabase
    .from("student_courses")
    .select("course_id")
    .in(
      "course_id",
      coursesData.map((c) => c.id)
    );

  if (countError) throw countError;

  // Create a count map for efficient lookup
  const countMap = new Map();
  studentCounts?.forEach((sc) => {
    countMap.set(sc.course_id, (countMap.get(sc.course_id) || 0) + 1);
  });

  const formatted = coursesData.map((c) => ({
    ...c,
    students: countMap.get(c.id) || 0,
  }));

  return formatted;
};

export const addCourse = async (name, description) => {
  const { data, error } = await supabase
    .from("courses")
    .insert({
      name,
      description: description || null,
    })
    .select()
    .single();

  if (error) throw error;

  await logActivity(`Created course "${data.name}"`);

  return { ...data, students: 0 };
};

export const updateCourse = async (id, name, description) => {
  const { error } = await supabase
    .from("courses")
    .update({
      name,
      description: description || null,
    })
    .eq("id", id);

  if (error) throw error;

  await logActivity(`Updated course "${name}"`);

  return { id, name, description };
};

export const deleteCourse = async (id, name) => {
  // First delete related syllabus topics
  const { error: syllabusError } = await supabase
    .from("course_syllabus")
    .delete()
    .eq("course_id", id);

  if (syllabusError) throw syllabusError;

  // Then delete related student_courses
  const { error: studentError } = await supabase
    .from("student_courses")
    .delete()
    .eq("course_id", id);

  if (studentError) throw studentError;

  // Then delete the course
  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) throw error;

  await logActivity(`Deleted course "${name}"`);
};

export const fetchSyllabus = async (courseId) => {
  const { data } = await supabase
    .from("course_syllabus")
    .select("id, title")
    .eq("course_id", courseId)
    .order("created_at");

  return data || [];
};

export const addSyllabusTopic = async (courseId, title) => {
  const { data, error } = await supabase
    .from("course_syllabus")
    .insert({
      course_id: courseId,
      title,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};
