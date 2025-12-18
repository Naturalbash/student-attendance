import { useState } from "react";
import { PlusCircle, Search, Users, Save, Edit, X } from "lucide-react";

/* =======================
   MOCK DATA
======================= */
const initialCourses = [
  { id: 1, name: "Web Development", students: 28 },
  { id: 2, name: "Graphic Design", students: 22 },
  { id: 3, name: "UI/UX Design", students: 18 },
  { id: 4, name: "Data Science", students: 12 },
  { id: 5, name: "Digital Marketing", students: 20 },
];

/* =======================
   MAIN PAGE
======================= */
const CoursesPage = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCourse = () => {
    if (!newCourseName.trim()) {
      alert("Please enter a course name.");
      return;
    }
    const newCourse = {
      id: Date.now(),
      name: newCourseName,
      students: 0,
    };
    setCourses([newCourse, ...courses]);
    setNewCourseName("");
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setEditName(course.name);
  };

  const handleSave = () => {
    if (!editName.trim()) {
      alert("Course name cannot be empty.");
      return;
    }
    setCourses(
      courses.map((c) => (c.id === editingId ? { ...c, name: editName } : c))
    );
    setEditingId(null);
    setEditName("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName("");
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Programs / Courses
          </h1>
          <p className="text-sm text-slate-500">
            Manage all digital skills courses offered to students
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* ADD COURSE FORM */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-md flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="New Course Name"
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
        />
        <button
          onClick={handleAddCourse}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 active:scale-95 transition"
        >
          <PlusCircle size={16} /> Add Course
        </button>
      </div>

      {/* COURSES TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-500">
              <th className="py-3 px-4">Course Name</th>
              <th className="py-3 px-4">Enrolled Students</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr
                key={course.id}
                className="border-b last:border-none hover:bg-slate-50 transition"
              >
                <td className="py-3 px-4 font-medium text-slate-800">
                  {editingId === course.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded border border-slate-200 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  ) : (
                    course.name
                  )}
                </td>
                <td className="py-3 px-4 flex items-center gap-1 text-slate-500">
                  <Users size={14} /> {course.students}
                </td>
                <td className="py-3 px-4 text-right">
                  {editingId === course.id ? (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleSave}
                        className="rounded-xl bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700 active:scale-95 transition"
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="rounded-xl bg-gray-600 px-3 py-1.5 text-xs text-white hover:bg-gray-700 active:scale-95 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(course)}
                      className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700 active:scale-95 transition"
                    >
                      <Edit size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default CoursesPage;
