import { useState } from "react";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

/* =======================
   MOCK DATA
======================= */
const studentAttendanceData = [
  { id: 1, course: "Web Development", attendance: "present" },
  { id: 2, course: "Graphic Design", attendance: "absent" },
  { id: 3, course: "UI/UX Design", attendance: "present" },
  { id: 4, course: "Data Science", attendance: "present" },
  { id: 5, course: "Digital Marketing", attendance: "absent" },
];

/* =======================
   MAIN PAGE
======================= */
const StudentAttendancePage = () => {
  const [attendance] = useState(studentAttendanceData);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");

  const filteredAttendance = attendance.filter((a) =>
    a.course.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = attendance.filter(
    (a) => a.attendance === "present"
  ).length;
  const absentCount = attendance.filter(
    (a) => a.attendance === "absent"
  ).length;

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500">
            View your daily attendance for enrolled courses
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

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Courses</p>
          <p className="text-2xl font-semibold text-slate-900">
            {attendance.length}
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
          <p className="text-2xl font-semibold text-rose-600">{absentCount}</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-500">
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredAttendance.map((a) => (
              <tr
                key={a.id}
                className="border-b last:border-none hover:bg-slate-50 transition"
              >
                <td className="py-3 px-4 font-medium text-slate-800">
                  {a.course}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1 ${
                      a.attendance === "present"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {a.attendance === "present" ? (
                      <CheckCircle size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    {a.attendance}
                  </span>
                </td>
              </tr>
            ))}
            {filteredAttendance.length === 0 && (
              <tr>
                <td colSpan="2" className="py-4 text-center text-slate-400">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default StudentAttendancePage;
