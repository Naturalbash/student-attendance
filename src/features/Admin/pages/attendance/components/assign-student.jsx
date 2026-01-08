import { PlusCircle } from "lucide-react";

export default function AssignStudent({
  assignForm,
  setAssignForm,
  students,
  courses,
  handleAssignStudent,
}) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 max-w-md space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <PlusCircle size={20} /> Assign Student to Course
      </h2>

      <select
        value={assignForm.studentId}
        onChange={(e) =>
          setAssignForm({ ...assignForm, studentId: e.target.value })
        }
        className="w-full rounded-xl border px-4 py-2 text-sm"
      >
        <option value="">Select Student</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.full_name}
          </option>
        ))}
      </select>

      <select
        value={assignForm.courseId}
        onChange={(e) =>
          setAssignForm({ ...assignForm, courseId: e.target.value })
        }
        className="w-full rounded-xl border px-4 py-2 text-sm"
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleAssignStudent}
        className="w-full rounded-xl bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700"
      >
        Assign Student
      </button>
    </div>
  );
}
