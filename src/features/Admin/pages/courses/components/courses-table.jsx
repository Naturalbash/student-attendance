import { Save, X, Edit, ChevronDown, Users } from "lucide-react";

export default function CoursesTable({
  loading,
  filteredCourses,
  editingId,
  editName,
  setEditName,
  handleSave,
  handleCancel,
  handleEdit,
  handleDelete,
  expandedCourseId,
  toggleExpand,
  syllabus,
  newSyllabus,
  setNewSyllabus,
  addSyllabus,
  renderSkeleton,
}) {
  return (
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
  );
}
