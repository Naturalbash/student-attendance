import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Search,
  Save,
  Calendar,
  PlusCircle,
} from "lucide-react";

/* =======================
   MOCK DATA
======================= */
const initialStudents = [
  { id: 1, name: "Ojo Henry", course: "Web Development" },
  { id: 2, name: "Sunday Tobi", course: "Graphic Design" },
  { id: 3, name: "Abdullah Mubaraq", course: "UI/UX Design" },
  { id: 4, name: "Sarah Wilson", course: "Data Science" },
  { id: 5, name: "Tajudeen Malik", course: "Digital Marketing" },
];

const courses = [
  "Web Development",
  "Graphic Design",
  "UI/UX Design",
  "Data Science",
  "Digital Marketing",
  "Digital Illustration",
  "Frontend Development",
];

/* =======================
   COMPONENT
======================= */
const AttendancePage = () => {
  const [students, setStudents] = useState(initialStudents);
  const [attendance, setAttendance] = useState({});
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  const [newStudent, setNewStudent] = useState({ name: "", course: "" });

  /* Initialize attendance */
  useEffect(() => {
    const initial = {};
    students.forEach((s) => (initial[s.id] = "present"));
    setAttendance(initial);
  }, [students]);

  /* Toggle present/absent */
  const toggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === "present" ? "absent" : "present",
    }));
  };

  /* Filter students */
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = Object.values(attendance).filter(
    (s) => s === "present"
  ).length;

  /* Save attendance */
  const handleSaveAttendance = () => {
    setSaving(true);
    setTimeout(() => {
      console.log("Attendance Saved:", { date, attendance });
      setSaving(false);
      alert("Attendance saved successfully!");
    }, 1200);
  };

  /* Add new student */
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.course) {
      alert("Please enter both name and course.");
      return;
    }
    const newId = Date.now();
    setStudents((prev) => [...prev, { id: newId, ...newStudent }]);
    setAttendance((prev) => ({ ...prev, [newId]: "present" }));
    setNewStudent({ name: "", course: "" });
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500">
            Mark and manage daily student attendance for digital skills courses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="text-slate-400" size={18} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Students</p>
          <p className="text-2xl font-semibold text-slate-900">
            {students.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Present</p>
          <p className="text-2xl font-semibold text-emerald-600">
            {presentCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Absent</p>
          <p className="text-2xl font-semibold text-rose-600">
            {students.length - presentCount}
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          placeholder="Search student or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* ADD STUDENT FORM */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-md space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <PlusCircle size={20} /> Add Student to Course
        </h2>
        <input
          type="text"
          placeholder="Student Full Name"
          value={newStudent.name}
          onChange={(e) =>
            setNewStudent({ ...newStudent, name: e.target.value })
          }
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
        />
        <select
          value={newStudent.course}
          onChange={(e) =>
            setNewStudent({ ...newStudent, course: e.target.value })
          }
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddStudent}
          className="w-full rounded-xl bg-indigo-600 py-2 text-white font-medium transition hover:bg-indigo-700 active:scale-95"
        >
          Add Student
        </button>
      </div>

      {/* ATTENDANCE TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-500">
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const status = attendance[student.id];
              return (
                <tr
                  key={student.id}
                  className="border-b last:border-none hover:bg-slate-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {student.name}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{student.course}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        status === "present"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleAttendance(student.id)}
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
                        status === "present"
                          ? "bg-rose-600 text-white hover:bg-rose-700"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {status === "present" ? (
                        <>
                          <XCircle size={14} /> Mark Absent
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} /> Mark Present
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveAttendance}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Attendance"}
        </button>
      </div>
    </main>
  );
};

export default AttendancePage;
