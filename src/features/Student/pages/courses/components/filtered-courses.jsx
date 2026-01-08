import { BookOpen, CheckCircle, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FilteredCourses({ filteredCourses, toggleSyllabus }) {
  return (
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
                        <CheckCircle className="text-emerald-500" size={18} />
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
  );
}
