import { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  Users,
  Save,
  Edit,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import supabase from "../../../utils/supabase";
import toast, { Toaster } from "react-hot-toast";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [newSyllabus, setNewSyllabus] = useState("");

  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH COURSES
  ======================= */
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data: coursesData, error } = await supabase
        .from("courses")
        .select("id, name, description, created_at");

      if (error) throw error;

      const { data: studentCourses } = await supabase
        .from("student_courses")
        .select("course_id");

      const formatted = coursesData.map((c) => ({
        ...c,
        students:
          studentCourses?.filter((sc) => sc.course_id === c.id)?.length || 0,
      }));

      setCourses(formatted);
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

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  /* =======================
     ACTIVITY LOG
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
      toast.error("Course name is required");
      return;
    }

    const { data, error } = await supabase
      .from("courses")
      .insert({
        name: newCourseName,
        description: newCourseDescription || null,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create course");
      return;
    }

    setCourses([{ ...data, students: 0 }, ...courses]);
    setNewCourseName("");
    setNewCourseDescription("");
    toast.success("Course created successfully");

    await logActivity(`Created course "${data.name}"`);
  };

  /* =======================
     EDIT COURSE
  ======================= */
  const handleEdit = (course) => {
    setEditingId(course.id);
    setEditName(course.name);
    setEditDescription(course.description || "");
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error("Course name cannot be empty");
      return;
    }

    const { error } = await supabase
      .from("courses")
      .update({
        name: editName,
        description: editDescription || null,
      })
      .eq("id", editingId);

    if (error) {
      toast.error("Failed to update course");
      return;
    }

    setCourses(
      courses.map((c) =>
        c.id === editingId
          ? { ...c, name: editName, description: editDescription }
          : c
      )
    );

    toast.success("Course updated");
    setEditingId(null);
    setEditName("");
    setEditDescription("");

    await logActivity(`Updated course "${editName}"`);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  /* =======================
     DELETE COURSE
  ======================= */
  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.name}"?`)) return;

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", course.id);

    if (error) {
      toast.error("Failed to delete course");
      return;
    }

    setCourses(courses.filter((c) => c.id !== course.id));
    toast.success("Course deleted");

    await logActivity(`Deleted course "${course.name}"`);
  };

  /* =======================
     TOGGLE DETAILS
  ======================= */
  const toggleExpand = async (course) => {
    if (expandedCourseId === course.id) {
      setExpandedCourseId(null);
      return;
    }

    setExpandedCourseId(course.id);

    const { data } = await supabase
      .from("course_syllabus")
      .select("id, title")
      .eq("course_id", course.id)
      .order("created_at");

    setSyllabus(data || []);
  };

  /* =======================
     ADD SYLLABUS TOPIC
  ======================= */
  const addSyllabus = async (courseId) => {
    if (!newSyllabus.trim()) return;

    const { data, error } = await supabase
      .from("course_syllabus")
      .insert({
        course_id: courseId,
        title: newSyllabus,
      })
      .select()
      .single();

    if (!error) {
      setSyllabus((prev) => [...prev, data]);
      setNewSyllabus("");
      toast.success("Syllabus topic added");
    }
  };

  /* =======================
     SKELETON LOADER
  ======================= */
  const renderSkeleton = () => (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={i} className="border-b">
          <td className="px-4 py-3">
            <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
          </td>
          <td className="px-4 py-3 text-slate-500 flex items-center gap-1 justify-end">
            <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
          </td>
          <td className="px-4 py-3 text-right">
            <div className="h-4 bg-slate-200 rounded w-1/3 ml-auto animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6 space-y-6">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
        <div>
          <h1 className="text-2xl font-semibold">Programs / Courses</h1>
          <p className="text-sm text-slate-500">Manage courses and syllabus</p>
        </div>

        <div className="relative max-w-md w-full sm:w-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full sm:w-64 rounded-xl border pl-10 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* ADD COURSE */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-md space-y-3">
        <input
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
          placeholder="Course name"
          className="w-full rounded-xl border px-4 py-2 text-sm"
        />
        <textarea
          rows={3}
          value={newCourseDescription}
          onChange={(e) => setNewCourseDescription(e.target.value)}
          placeholder="Course description (optional)"
          className="w-full rounded-xl border px-4 py-2 text-sm resize-none"
        />
        <button
          onClick={handleAddCourse}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm"
        >
          <PlusCircle size={16} /> Add Course
        </button>
      </div>

      {/* COURSES TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-500">
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Students</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? renderSkeleton()
              : filteredCourses.map((course) => (
                  <>
                    <tr key={course.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">
                        {editingId === course.id ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                          />
                        ) : (
                          <span
                            onClick={() => toggleExpand(course)}
                            className="cursor-pointer flex items-center gap-1"
                          >
                            {course.name} <ChevronDown size={14} />
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-slate-500 flex items-center gap-1">
                        <Users size={14} /> {course.students}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {editingId === course.id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleSave}
                              className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                              <Save size={14} />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-600 text-white px-3 py-1 rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(course)}
                              className="bg-indigo-600 text-white px-3 py-1 rounded"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(course)}
                              className="bg-rose-600 text-white px-3 py-1 rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>

                    {expandedCourseId === course.id && (
                      <tr className="bg-slate-50">
                        <td colSpan="3" className="px-6 py-4 space-y-4">
                          <div>
                            <p className="font-medium text-sm">Description</p>
                            <p className="text-sm text-slate-600">
                              {course.description ||
                                "No course description provided"}
                            </p>
                          </div>

                          <div>
                            <p className="font-medium text-sm mb-2">Syllabus</p>

                            {syllabus.length === 0 ? (
                              <p className="text-sm text-slate-400">
                                No syllabus yet
                              </p>
                            ) : (
                              <ul className="list-disc ml-5 text-sm space-y-1">
                                {syllabus.map((s) => (
                                  <li key={s.id}>{s.title}</li>
                                ))}
                              </ul>
                            )}

                            <input
                              value={newSyllabus}
                              onChange={(e) => setNewSyllabus(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && addSyllabus(course.id)
                              }
                              placeholder="Add syllabus topic and press Enter"
                              className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default CoursesPage;
