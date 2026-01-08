import { useEffect, useState } from "react";
import { BookOpen, CheckCircle, PlayCircle, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchStudentCourses,
  toggleSyllabusCompletion,
  setupCoursesRealtime,
} from "./utils/courseActions";
import SearchField from "./components/search-field";
import FilteredCourses from "./components/filtered-courses";
import CongratsModal from "./components/congrats-modal";

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedCourse, setCompletedCourse] = useState(null);
  const [search, setSearch] = useState("");

  const loadCourses = async () => {
    setLoading(true);
    try {
      const enriched = await fetchStudentCourses();
      setCourses(enriched);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();

    /* REALTIME SYNC + ACTIVITY LOGGING */
    const unsubscribe = setupCoursesRealtime(loadCourses);

    return unsubscribe;
  }, []);

  const toggleSyllabus = async (course, syllabusItem) => {
    try {
      const result = await toggleSyllabusCompletion(course, syllabusItem);

      setCourses((prev) =>
        prev.map((c) =>
          c.course_id === course.course_id
            ? {
                ...c,
                syllabus: result.updatedSyllabus,
                progress: result.progress,
              }
            : c
        )
      );

      toast.success(
        `"${syllabusItem.title}" marked ${
          !syllabusItem.completed ? "complete" : "incomplete"
        }`
      );

      if (result.isCompleted) setCompletedCourse(course.name);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update syllabus");
    }
  };

  const filteredCourses = courses.filter((c) => {
    const name = c.name || "";
    const description = c.description || "";
    const searchText = (search || "").toLowerCase();
    return (
      name.toLowerCase().includes(searchText) ||
      description.toLowerCase().includes(searchText)
    );
  });

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-500">
            Continue your courses and track your learning progress
          </p>
        </div>

        <SearchField search={search} setSearch={setSearch} />
      </div>

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
        <FilteredCourses
          filteredCourses={filteredCourses}
          toggleSyllabus={toggleSyllabus}
        />
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
