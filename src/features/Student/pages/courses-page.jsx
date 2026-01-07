import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import { BookOpen, CheckCircle, PlayCircle, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { logActivity } from "../../../utils/activity-logger";

/* ========================= CONGRATS MODAL ========================= */
const CongratsModal = ({ open, courseTitle, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 30 }}
            transition={{ type: "spring", damping: 18 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              🎉 Course Completed!
            </h2>
            <p className="text-slate-600 mb-6">
              You’ve successfully completed <strong>{courseTitle}</strong>. Keep
              up the great work!
            </p>
            <button
              onClick={onClose}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              Continue Learning
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ========================= MAIN PAGE ========================= */
const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedCourse, setCompletedCourse] = useState(null);
  const [search, setSearch] = useState("");

  /* ========================= FETCH COURSES + SYLLABUS + PROGRESS ========================= */
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

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
          const completedCount = Math.round(
            (sc.progress / 100) * totalSyllabus
          );

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

      setCourses(enriched);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();

    /* REALTIME SYNC + ACTIVITY LOGGING */
    const setupRealtime = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const channel = supabase
        .channel("student-courses")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "student_course_syllabus" },
          fetchCourses
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "student_courses" },
          fetchCourses
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "activity_logs" },
          fetchCourses
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    setupRealtime();
  }, []);

  /* ========================= TOGGLE SYLLABUS COMPLETION ========================= */
  const toggleSyllabus = async (course, syllabusItem) => {
    try {
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

      setCourses((prev) =>
        prev.map((c) =>
          c.course_id === course.course_id
            ? { ...c, syllabus: updatedSyllabus, progress }
            : c
        )
      );

      // Log activity
      await logActivity(
        `${syllabusItem.title} marked ${
          newCompleted ? "complete" : "incomplete"
        }`
      );

      toast.success(
        `"${syllabusItem.title}" marked ${
          newCompleted ? "complete" : "incomplete"
        }`
      );

      if (progress === 100) setCompletedCourse(course.name);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update syllabus");
    }
  };

  /* ========================= SEARCH FILTER ========================= */
  const filteredCourses = courses.filter((c) => {
    const name = c.name || "";
    const description = c.description || "";
    const searchText = (search || "").toLowerCase();
    return (
      name.toLowerCase().includes(searchText) ||
      description.toLowerCase().includes(searchText)
    );
  });

  /* ========================= RENDER ========================= */
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-500">
            Continue your courses and track your learning progress
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Courses */}
      {loading ? (
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md animate-pulse h-72"
              />
            ))}
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <p className="text-slate-500">No courses found.</p>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const nextModule = course.syllabus.find((s) => !s.completed);
              return (
                <div
                  key={course.course_id}
                  className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col"
                >
                  {/* header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="text-indigo-600" />
                      <h3 className="font-semibold text-slate-900">
                        {course.name}
                      </h3>
                    </div>
                    <span className="text-sm font-medium text-indigo-600">
                      {course.progress}%
                    </span>
                  </div>

                  {/* progress bar */}
                  <div className="h-2 bg-slate-200 rounded-full mb-4">
                    <div
                      className="h-2 bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>

                  {/* description */}
                  <p className="text-sm text-slate-500 mb-4">
                    {course.description}
                  </p>

                  {/* syllabus */}
                  <ul className="space-y-3 flex-1">
                    {course.syllabus.map((s) => {
                      const isNext = nextModule && nextModule.id === s.id;
                      return (
                        <motion.li
                          key={s.id}
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                            s.completed
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-50 hover:bg-slate-100"
                          } ${
                            isNext && !s.completed
                              ? "border border-indigo-300 shadow-sm"
                              : ""
                          }`}
                          onClick={() => toggleSyllabus(course, s)}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-sm font-medium">
                            {s.title}
                            {isNext && !s.completed && (
                              <span className="ml-2 text-xs text-indigo-600 font-normal">
                                (Next)
                              </span>
                            )}
                          </span>
                          {s.completed ? (
                            <CheckCircle
                              className="text-emerald-500"
                              size={18}
                            />
                          ) : (
                            <PlayCircle className="text-slate-400" size={18} />
                          )}
                        </motion.li>
                      );
                    })}
                  </ul>

                  {/* Animated Call-to-action button */}
                  {nextModule && (
                    <motion.button
                      key={nextModule.id}
                      initial={{ scale: 0.95, opacity: 0.8 }}
                      animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        repeat: 1,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      }}
                      onClick={() => toggleSyllabus(course, nextModule)}
                      className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
                    >
                      Continue to "{nextModule.title}"
                    </motion.button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* congrats modal */}
      <CongratsModal
        open={!!completedCourse}
        courseTitle={completedCourse}
        onClose={() => setCompletedCourse(null)}
      />
    </main>
  );
};

export default MyCoursesPage;
