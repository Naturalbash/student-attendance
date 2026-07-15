import { Pencil, Trash2 } from "lucide-react";

export default function StudentTable({
  students,
  setEditTarget,
  setDeleteTarget,
}) {
  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString();
  };

  return (
    <>
      <div className="hidden w-full overflow-x-auto rounded-2xl bg-white shadow md:block">
        <table className="min-w-[760px] w-full text-sm">
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
              students.map((s) => {
                const courses =
                  s.student_courses?.map((sc) => sc.course_name).join(", ") ||
                  "—";

                return (
                  <tr key={s.id} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-2 whitespace-nowrap">
                      {s.full_name}
                    </td>
                    <td className="px-4 py-2 break-all">{s.email}</td>
                    <td className="max-w-[240px] px-4 py-2 break-words">
                      {courses}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {formatDate(s.created_at)}
                    </td>
                    <td className="flex justify-center gap-3 px-4 py-2 whitespace-nowrap">
                      <button
                        onClick={() =>
                          setEditTarget({
                            ...s,
                            courseIds: s.student_courses.map(
                              (sc) => sc.course_id,
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {students.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-slate-500 shadow-sm">
            No students have been added yet.
          </div>
        ) : (
          students.map((s) => {
            const courses =
              s.student_courses?.map((sc) => sc.course_name).join(", ") || "—";

            return (
              <div
                key={s.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {s.full_name}
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-600">
                      {s.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setEditTarget({
                          ...s,
                          courseIds: s.student_courses.map(
                            (sc) => sc.course_id,
                          ),
                        })
                      }
                      className="rounded-full p-2 text-indigo-600 hover:bg-indigo-50"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(s)}
                      className="rounded-full p-2 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div>
                    <span className="font-medium text-slate-500">Courses:</span>{" "}
                    <span className="text-slate-700">{courses}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">
                      Enrolled:
                    </span>{" "}
                    <span className="text-slate-700">
                      {formatDate(s.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
