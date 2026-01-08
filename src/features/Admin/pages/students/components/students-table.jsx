import { Pencil, Trash2 } from "lucide-react";

export default function StudentTable({
  students,
  setEditTarget,
  setDeleteTarget,
}) {
  return (
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
              <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                No students have been added yet.
              </td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s.id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-2">{s.full_name}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">
                  {s.student_courses?.map((sc) => sc.course_name).join(", ") ||
                    "—"}
                </td>
                <td className="px-4 py-2">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 flex justify-center gap-3">
                  <button
                    onClick={() =>
                      setEditTarget({
                        ...s,
                        courseIds: s.student_courses.map((sc) => sc.course_id),
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
  );
}
