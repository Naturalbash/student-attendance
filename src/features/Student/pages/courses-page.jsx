import { useState, useEffect } from "react";
import { BookOpen, PlayCircle, CheckCircle, Loader2 } from "lucide-react";
import supabase from "../../../utils/supabase";
import toast, { Toaster } from "react-hot-toast";

/* =======================
   COURSE CARD
======================= */
const CourseCard = ({ course, onUpdate }) => {
  const total = course.syllabus?.length || 0;
  const completed = course.syllabus?.filter((s) => s.completed).length || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Toggle completion
  const toggleSyllabus = async (syllabusId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const syllabusItem = course.syllabus.find((s) => s.id === syllabusId);
      const newCompleted = !syllabusItem.completed;

      // Update in DB
      await supabase.from("course_syllabus").upsert({
        student_id: userData.user.id,
        syllabus_id: syllabusId,
        completed: newCompleted,
      });

      // Update local state
      const updatedSyllabus = course.syllabus.map((s) =>
        s.id === syllabusId ? { ...s, completed: newCompleted } : s
      );

      onUpdate(course.id, updatedSyllabus);

      toast.success(
        `Module "${syllabusItem.title}" marked ${
          newCompleted ? "complete" : "incomplete"
        }`
      );

      if (updatedSyllabus.every((s) => s.completed)) {
        toast.success(`🎉 You have completed the course "${course.name}"!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update module completion");
    }
  };

  // CTA button text
  const nextModule = course.syllabus?.find((s) => !s.completed);
  const buttonText = nextModule
    ? `Continue to "${nextModule.title}"`
    : "🎉 Congratulations! Review Course";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md hover:shadow-xl transition flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BookOpen className="text-indigo-600" size={26} />
          <h3 className="text-lg font-bold text-slate-900">{course.name}</h3>
        </div>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${
            progress === 100
              ? "bg-emerald-100 text-emerald-700"
              : "bg-indigo-100 text-indigo-700"
          }`}
        >
          {progress}% Complete
        </span>
      </div>
      {/* Description */}
      <p className="text-sm text-slate-500 mb-4">
        {course.description || "No course description provided"}
      </p>
      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-4">
        <div
          className="h-2 rounded-full bg-indigo-600"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Syllabus */}
      {course.syllabus?.length > 0 && (
        <div className="mb-5 flex-1">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">
            Syllabus
          </h4>
          <ul className="flex flex-col gap-2">
            {course.syllabus.map((s) => (
              <li
                key={s.id}
                className={`flex items-center gap-2 text-sm text-slate-600 cursor-pointer ${
                  s.completed ? "line-through text-slate-400" : ""
                }`}
                onClick={() => toggleSyllabus(s.id)}
              >
                <CheckCircle
                  size={16}
                  className={s.completed ? "text-green-500" : "text-slate-300"}
                />
                {s.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA Button */}
      <button
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 transition active:scale-95 mt-auto"
        onClick={() => {
          if (nextModule) {
            // Just mark the next incomplete module as completed
            toggleSyllabus(nextModule.id);
          } else {
            toast(`🎉 You've completed "${course.name}"!`);
          }
        }}
      >
        <PlayCircle size={16} />
        {buttonText}
      </button>
    </div>
  );
};

/* =======================
   MAIN PAGE
======================= */
const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch courses and syllabus
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        toast.error("User not authenticated");
        setLoading(false);
        return;
      }

      // Student courses
      const { data: studentCourses, error: courseErr } = await supabase
        .from("student_courses")
        .select("course_id (id, name, description)")
        .eq("student_id", userData.user.id);

      if (courseErr) throw courseErr;

      // Map syllabus and completion
      const coursesWithSyllabus = await Promise.all(
        studentCourses.map(async (sc) => {
          const { data: syllabusData } = await supabase
            .from("course_syllabus")
            .select("id, title")
            .eq("course_id", sc.course_id.id)
            .order("created_at");

          const { data: completedData } = await supabase
            .from("student_course_syllabus")
            .select("syllabus_id, completed")
            .eq("student_id", userData.user.id);

          const syllabus = (syllabusData || []).map((s) => ({
            ...s,
            completed: completedData?.some(
              (c) => c.syllabus_id === s.id && c.completed
            ),
          }));

          return {
            id: sc.course_id.id,
            name: sc.course_id.name,
            description: sc.course_id.description,
            syllabus,
          };
        })
      );

      setCourses(coursesWithSyllabus);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description &&
        c.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSyllabusUpdate = (courseId, updatedSyllabus) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, syllabus: updatedSyllabus } : c
      )
    );
  };

  // Skeleton loader
  const renderSkeleton = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md animate-pulse h-72"
      />
    ));

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
          <p className="text-sm text-slate-500">
            View and continue your enrolled courses
          </p>
        </div>

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

      {/* COURSES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          renderSkeleton()
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onUpdate={handleSyllabusUpdate}
            />
          ))
        ) : (
          <p className="text-slate-500 col-span-full text-center">
            No courses found.
          </p>
        )}
      </div>
    </main>
  );
};

export default MyCoursesPage;
