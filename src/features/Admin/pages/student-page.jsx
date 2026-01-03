import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";
import { Plus, X, Pencil, Trash2, Loader2 } from "lucide-react";

/* =======================
   CONFIRM MODAL
======================= */
const ConfirmModal = ({ open, title, message, onConfirm, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

/* =======================
   ADD / EDIT MODAL
======================= */
const StudentModal = ({ open, onClose, onSubmit, courses, initial }) => {
  const [form, setForm] = useState(
    initial || { name: "", email: "", courseIds: [] }
  );

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {initial ? "Edit Student" : "Add Student"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border px-4 py-2"
          />

          {!initial && (
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border px-4 py-2"
            />
          )}

          <select
            multiple
            value={form.courseIds}
            onChange={(e) =>
              setForm({
                ...form,
                courseIds: Array.from(e.target.selectedOptions, (o) => o.value),
              })
            }
            className="w-full rounded-xl border px-4 py-2 h-32"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => onSubmit(form)}
            className="w-full rounded-xl bg-indigo-600 py-2 text-white hover:bg-indigo-700"
          >
            {initial ? "Save Changes" : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =======================
   MAIN PAGE
======================= */
const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ========= ACTIVITY LOGGER ========= */
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

  const fetchData = async () => {
    setLoading(true);

    const { data: studentsData } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, created_at, student_courses(course_id, course_name, progress)"
      )
      .eq("role", "student");

    const { data: coursesData } = await supabase
      .from("courses")
      .select("id, name");

    setStudents(studentsData || []);
    setCourses(coursesData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ========= ADD ========= */
  const handleAddStudent = async ({ name, email, courseIds }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: "default123",
    });

    if (error) return alert(error.message);

    const userId = data.user.id;

    await supabase.from("profiles").insert({
      id: userId,
      full_name: name,
      email,
      role: "student",
    });

    if (courseIds.length) {
      const mappedCourses = courseIds.map((cid) => {
        const course = courses.find((c) => c.id === cid);

        return {
          student_id: userId,
          course_id: cid,
          course_name: course?.name || "",
          progress: 0,
        };
      });

      const { error } = await supabase
        .from("student_courses")
        .insert(mappedCourses);

      if (error) {
        console.error(error);
        alert("Failed to assign courses");
        return;
      }
    }

    await logActivity(`You Added new student "${name}"`);

    fetchData();
    setModalOpen(false);
  };

  /* ========= EDIT ========= */
  const handleEditStudent = async ({ name, courseIds }) => {
    await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", editTarget.id);

    await supabase
      .from("student_courses")
      .delete()
      .eq("student_id", editTarget.id);

    if (courseIds.length) {
      const mappedCourses = courseIds.map((cid) => {
        const course = courses.find((c) => c.id === cid);

        return {
          student_id: editTarget.id,
          course_id: cid,
          course_name: course?.name || "",
          progress: 0,
        };
      });

      await supabase.from("student_courses").insert(mappedCourses);
    }

    await logActivity(`You Edited student "${name}"`);

    fetchData();
    setEditTarget(null);
  };

  /* ========= DELETE ========= */
  const handleDeleteStudent = async () => {
    await supabase
      .from("student_courses")
      .delete()
      .eq("student_id", deleteTarget.id);

    await supabase.from("profiles").delete().eq("id", deleteTarget.id);

    await logActivity(
      `You Deleted "${deleteTarget.full_name}" from the students`
    );

    fetchData();
    setDeleteTarget(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Students</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 shadow"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Courses</th>
                <th className="px-4 py-3 text-left">Enrolled</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    No students have been added yet.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-2">{s.full_name}</td>
                    <td className="px-4 py-2">{s.email}</td>
                    <td className="px-4 py-2">
                      {s.student_courses
                        ?.map((sc) => sc.course_name)
                        .join(", ") || "—"}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 flex justify-center gap-3">
                      <button
                        onClick={() =>
                          setEditTarget({
                            ...s,
                            courseIds: s.student_courses.map(
                              (sc) => sc.course_id
                            ),
                          })
                        }
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="text-rose-600 hover:text-rose-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <StudentModal
        open={modalOpen || !!editTarget}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        onSubmit={editTarget ? handleEditStudent : handleAddStudent}
        courses={courses}
        initial={editTarget}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Student"
        message="This will remove the student from the system. Continue?"
        onConfirm={handleDeleteStudent}
        onClose={() => setDeleteTarget(null)}
      />
    </main>
  );
};

export default AdminStudentsPage;
