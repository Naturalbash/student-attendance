import { useState, useEffect } from "react";
import { X } from "lucide-react";

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

export default StudentModal;
