import { useState } from "react";
import { BookOpen, PlayCircle, CheckCircle } from "lucide-react";

/* =======================
   MOCK DATA
======================= */
const studentCourses = [
  {
    id: 1,
    title: "Web Development",
    description:
      "Learn HTML, CSS, JavaScript, and React to build modern web apps.",
    progress: 45,
    modules: [
      "HTML Basics",
      "CSS Flexbox & Grid",
      "JavaScript Fundamentals",
      "React Basics",
    ],
  },
  {
    id: 2,
    title: "Graphic Design",
    description:
      "Master Photoshop, Illustrator, and Figma for professional design.",
    progress: 75,
    modules: ["Photoshop Basics", "Illustrator Vectors", "Figma UI Design"],
  },
  {
    id: 3,
    title: "UI/UX Design",
    description: "Learn to design intuitive interfaces and user experiences.",
    progress: 20,
    modules: ["UX Principles", "Wireframing", "Prototyping in Figma"],
  },
  {
    id: 4,
    title: "Data Science",
    description:
      "Analyze data, build models, and visualize insights using Python.",
    progress: 55,
    modules: [
      "Python Basics",
      "Data Analysis with Pandas",
      "Visualization with Matplotlib",
    ],
  },
];

/* =======================
   COMPONENTS
======================= */
const CourseCard = ({ course }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md hover:shadow-xl transition">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <BookOpen className="text-indigo-600" size={26} />
        <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
      </div>
      <span
        className={`text-sm font-semibold px-3 py-1 rounded-full ${
          course.progress === 100
            ? "bg-emerald-100 text-emerald-700"
            : "bg-indigo-100 text-indigo-700"
        }`}
      >
        {course.progress}% Complete
      </span>
    </div>

    {/* Description */}
    <p className="text-sm text-slate-500 mb-4">{course.description}</p>

    {/* Progress bar */}
    <div className="w-full h-2 bg-slate-200 rounded-full mb-4">
      <div
        className="h-2 rounded-full bg-indigo-600"
        style={{ width: `${course.progress}%` }}
      />
    </div>

    {/* Modules */}
    <div className="mb-5">
      <h4 className="text-sm font-semibold text-slate-700 mb-2">Modules</h4>
      <ul className="flex flex-col gap-2">
        {course.modules.map((mod, idx) => (
          <li
            key={idx}
            className="flex items-center gap-2 text-sm text-slate-600"
          >
            <CheckCircle size={16} className="text-green-500" />
            {mod}
          </li>
        ))}
      </ul>
    </div>

    {/* Action button */}
    <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 transition active:scale-95">
      <PlayCircle size={16} />
      {course.progress === 100 ? "Review Course" : "Continue Course"}
    </button>
  </div>
);

/* =======================
   MAIN PAGE
======================= */
const MyCoursesPage = () => {
  const [courses] = useState(studentCourses);
  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        {filteredCourses.length === 0 && (
          <p className="text-slate-500 col-span-full text-center">
            No courses found.
          </p>
        )}
      </div>
    </main>
  );
};

export default MyCoursesPage;
