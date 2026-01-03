import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";
import {
  CheckCircle,
  XCircle,
  Search,
  Save,
  Calendar,
  PlusCircle,
  Loader2,
} from "lucide-react";

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [assignForm, setAssignForm] = useState({
    studentId: "",
    courseId: "",
  });

  /* =======================
     ACTIVITY LOGGER
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
     FETCH DATA
  ======================= */
  const fetchData = async () => {
    setLoading(true);

    const { data: studentsData } = await supabase
      .from("profiles")
      .select("id, full_name, student_courses(course_id, courses(name))")
      .eq("role", "student");

    const { data: coursesData } = await supabase
      .from("courses")
      .select("id, name");

    const { data: attendanceData } = await supabase
      .from("attendance")
      .select("student_id, status")
      .eq("attendance_date", date);

    const initialAttendance = {};
    attendanceData?.forEach((a) => {
      initialAttendance[a.student_id] = a.status;
    });

    studentsData?.forEach((s) => {
      if (!initialAttendance[s.id]) {
        initialAttendance[s.id] = "present";
      }
    });

    setStudents(studentsData || []);
    setCourses(coursesData || []);
    setAttendance(initialAttendance);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  /* =======================
     TOGGLE ATTENDANCE
  ======================= */
  const toggleAttendance = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  /* =======================
     SAVE ATTENDANCE
  ======================= */
  const handleSaveAttendance = async () => {
    setSaving(true);

    const records = Object.entries(attendance).map(([student_id, status]) => ({
      student_id,
      attendance_date: date,
      status,
    }));

    await supabase.from("attendance").upsert(records, {
      onConflict: "student_id,attendance_date",
    });

    await logActivity("Marked attendance");

    setSaving(false);
  };

  /* =======================
     ASSIGN STUDENT TO COURSE
  ======================= */
  const handleAssignStudent = async () => {
    if (!assignForm.studentId || !assignForm.courseId) return;

    await supabase.from("student_courses").insert({
      student_id: assignForm.studentId,
      course_id: assignForm.courseId,
      progress: 0,
    });

    const student = students.find((s) => s.id === assignForm.studentId);
    const course = courses.find((c) => c.id === assignForm.courseId);

    await logActivity(`Assigned ${student?.full_name} to ${course?.name}`);

    setAssignForm({ studentId: "", courseId: "" });
    fetchData();
  };

  /* =======================
     FILTER
  ======================= */
  const filteredStudents = students.filter((s) =>
    s.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = Object.values(attendance).filter(
    (s) => s === "present"
  ).length;

  /* =======================
     UI
  ======================= */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500">
            Mark and manage daily student attendance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="text-slate-400" size={18} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border shadow-sm">
          <p className="text-sm text-slate-500">Total Students</p>
          <p className="text-2xl font-semibold">{students.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border shadow-sm">
          <p className="text-sm text-slate-500">Present</p>
          <p className="text-2xl font-semibold text-emerald-600">
            {presentCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border shadow-sm">
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
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border bg-white py-2 pl-10 pr-4 text-sm"
        />
      </div>

      {/* ASSIGN STUDENT */}
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

      {/* TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => {
              const status = attendance[s.id];
              const course = s.student_courses?.[0]?.courses?.name || "—";

              return (
                <tr
                  key={s.id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{s.full_name}</td>
                  <td className="px-4 py-3 text-slate-500">{course}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        status === "present"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleAttendance(s.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-white ${
                        status === "present"
                          ? "bg-rose-600 hover:bg-rose-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {status === "present" ? (
                        <>
                          <XCircle size={14} /> Absent
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} /> Present
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

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveAttendance}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Attendance"}
        </button>
      </div>
    </main>
  );
};

export default AttendancePage;
