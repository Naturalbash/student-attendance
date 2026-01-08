import supabase from "../../../../../utils/supabase";
import { logActivity } from "../../../../../utils/activity-logger";

export const fetchStudentCourses = async () => {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return [];

  const { data: studentCourses, error: scErr } = await supabase
    .from("student_courses")
    .select("*")
    .eq("student_id", auth.user.id);
  if (scErr) throw scErr;

  const enriched = await Promise.all(
    studentCourses.map(async (sc) => {
      const { data: courseInfo } = await supabase
        .from("courses")
        .select("*")
        .eq("id", sc.course_id)
        .single();

      const { data: syllabus } = await supabase
        .from("course_syllabus")
        .select("*")
        .eq("course_id", sc.course_id)
        .order("created_at", { ascending: true });

      // Calculate completed based on stored progress
      const totalSyllabus = syllabus.length;
      const completedCount = Math.round((sc.progress / 100) * totalSyllabus);

      const mergedSyllabus = syllabus.map((s, index) => ({
        ...s,
        completed: index < completedCount,
      }));

      return {
        student_course_id: sc.id,
        course_id: courseInfo.id,
        name: courseInfo.name,
        description: courseInfo.description || "No description available",
        syllabus: mergedSyllabus,
        progress: sc.progress || 0,
      };
    })
  );

  return enriched;
};

export const toggleSyllabusCompletion = async (course, syllabusItem) => {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return;

  const newCompleted = !syllabusItem.completed;

  // Upsert completion
  await supabase.from("student_course_syllabus").upsert({
    student_id: auth.user.id,
    course_id: course.course_id,
    syllabus_id: syllabusItem.id,
    completed: newCompleted,
  });

  // Update progress
  const updatedSyllabus = course.syllabus.map((s) =>
    s.id === syllabusItem.id ? { ...s, completed: newCompleted } : s
  );

  const total = updatedSyllabus.length;
  const done = updatedSyllabus.filter((s) => s.completed).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  await supabase
    .from("student_courses")
    .update({ progress })
    .eq("id", course.student_course_id);

  // Log activity
  await logActivity(
    `${syllabusItem.title} marked ${newCompleted ? "complete" : "incomplete"}`
  );

  return {
    updatedSyllabus,
    progress,
    isCompleted: progress === 100,
  };
};

export const setupCoursesRealtime = (onUpdate) => {
  const channel = supabase
    .channel("student-courses")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "student_course_syllabus" },
      onUpdate
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "student_courses" },
      onUpdate
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "activity_logs" },
      onUpdate
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};
