import { useState, useEffect } from "react";
import { PlusCircle, Search, Users, Save, Edit, X } from "lucide-react";
import supabase from "../../../utils/supabase";
import toast, { Toaster } from "react-hot-toast"; // import react-hot-toast

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  /* =======================
     FETCH COURSES WITH STUDENT COUNT
  ======================= */
  const fetchCourses = async () => {
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("id, name, created_at");

      if (coursesError) throw coursesError;

      // get student counts per course
      const { data: studentCourses } = await supabase
        .from("student_courses")
        .select("course_id");

      const formattedCourses = coursesData.map((c) => {
        const count = studentCourses?.filter(
          (sc) => sc.course_id === c.id
        )?.length;
        return { ...c, students: count || 0 };
      });

      setCourses(formattedCourses);
    } catch (err) {
      console.error("Fetch courses error:", err);
      toast.error("Failed to load courses!");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  /* =======================
     LOG ACTIVITY
  ======================= */
  const logActivity = async (action) => {
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

  /* =======================
     ADD COURSE
  ======================= */
  const handleAddCourse = async () => {
    if (!newCourseName.trim()) {
      toast.error("Please enter a course name.");
      return;
    }

    const { data, error } = await supabase
      .from("courses")
      .insert([{ name: newCourseName }])
      .select()
      .single();

    if (error) {
      console.error("Add course error:", error);
      toast.error("Failed to create course");
      return;
    }

    setCourses([{ ...data, students: 0 }, ...courses]);
    setNewCourseName("");
    toast.success(`Course "${data.name}" added successfully!`);

    await logActivity(`Created course "${data.name}"`);
  };

  /* =======================
     EDIT COURSE
  ======================= */
  const handleEdit = (course) => {
    setEditingId(course.id);
    setEditName(course.name);
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error("Course name cannot be empty.");
      return;
    }

    const { error } = await supabase
      .from("courses")
      .update({ name: editName })
      .eq("id", editingId);

    if (error) {
      console.error("Update course error:", error);
      toast.error("Failed to update course");
      return;
    }

    setCourses(
      courses.map((c) => (c.id === editingId ? { ...c, name: editName } : c))
    );
    toast.success("Course name updated!");
    setEditingId(null);
    setEditName("");

    await logActivity(`Updated course name to "${editName}"`);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName("");
  };

  /* =======================
     DELETE COURSE
  ======================= */
  const handleDelete = async (course) => {
    const confirm = window.confirm(
      `Are you sure you want to delete the course "${course.name}"?`
    );
    if (!confirm) return;

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", course.id);

    if (error) {
      console.error("Delete course error:", error);
      toast.error("Failed to delete course!");
      return;
    }

    setCourses(courses.filter((c) => c.id !== course.id));
    toast.success(`Course "${course.name}" deleted successfully!`);

    await logActivity(`Deleted course "${course.name}"`);
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      {/* TOASTER */}
      <Toaster position="top-right" reverseOrder={false} />

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
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(course)}
                        className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700 active:scale-95 transition"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(course)}
                        className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs text-white hover:bg-rose-700 active:scale-95 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
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
