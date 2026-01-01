import { useEffect, useState } from "react";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import supabase from "../../../utils/supabase";
import { getStudentAttendance } from "../../../utils/attendance";

const StudentAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttendance = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAttendance([]);
        setLoading(false);
        return;
      }

      const data = await getStudentAttendance(user.id, date);
      setAttendance(data);
      setLoading(false);
    };

    loadAttendance();
  }, [date]);

  const filteredAttendance = attendance.filter((a) =>
    a.course.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = attendance.filter(
    (a) => a.attendance === "present"
  ).length;

  const absentCount = attendance.filter(
    (a) => a.attendance === "absent"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <Calendar className="h-8 w-8 text-indigo-600" />
          <p className="text-sm text-slate-500">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500">View your daily attendance</p>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="text-slate-400" size={18} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total Courses" value={attendance.length} />
        <SummaryCard label="Present" value={presentCount} color="emerald" />
        <SummaryCard label="Absent" value={absentCount} color="rose" />
      </div>

      <input
        type="text"
        placeholder="Search course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md rounded-xl border px-4 py-2 text-sm"
      />

      <AttendanceTable data={filteredAttendance} />
    </main>
  );
};

export default StudentAttendancePage;

const SummaryCard = ({ label, value, color = "slate" }) => (
  <div className="bg-white rounded-2xl border p-4 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`text-2xl font-semibold text-${color}-600`}>{value}</p>
  </div>
);

const AttendanceTable = ({ data }) => (
  <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-slate-50 border-b">
        <tr className="text-left text-slate-500">
          <th className="py-3 px-4">Course</th>
          <th className="py-3 px-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((a) => (
          <tr key={a.id} className="border-b hover:bg-slate-50">
            <td className="py-3 px-4 font-medium">{a.course}</td>
            <td className="py-3 px-4">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
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
        {data.length === 0 && (
          <tr>
            <td colSpan="2" className="py-6 text-center text-slate-400">
              No attendance records found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
