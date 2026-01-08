import { useState, useEffect, useCallback } from "react";
import { Save, Calendar, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchAttendanceData,
  saveAttendance,
  assignStudent,
} from "./utils/attendanceActions";
import AttendanceSummary from "./components/attendance-summary";
import SearchField from "./components/search-field";
import AssignStudent from "./components/assign-student";
import StudentAttendanceTable from "./components/attendance-table";

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

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAttendanceData(date);
      setStudents(data.students);
      setCourses(data.courses);
      setAttendance(data.attendance);
    } catch (error) {
      console.error("Failed to load attendance data:", error);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleAttendance = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      await saveAttendance(students, attendance, date);
      toast.success("Attendance saved successfully");
      // Optionally reload data after saving
      await loadData();
    } catch (err) {
      console.error("Failed to save attendance:", err);
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignStudent = async () => {
    if (!assignForm.studentId || !assignForm.courseId) return;

    const course = courses.find((c) => c.id === assignForm.courseId);
    const student = students.find((s) => s.id === assignForm.studentId);

    try {
      await assignStudent(
        assignForm.studentId,
        assignForm.courseId,
        course?.name,
        student.full_name
      );
      toast.success("Student assigned successfully");
      setAssignForm({ studentId: "", courseId: "" });
      // Optionally reload data after assigning
      await loadData();
    } catch (err) {
      console.error("Failed to assign student:", err);
      toast.error(err.message);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = Object.values(attendance).filter(
    (s) => s === "present"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Attendance
            </h1>
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
        <AttendanceSummary students={students} presentCount={presentCount} />

        {/* SEARCH */}
        <SearchField search={search} setSearch={setSearch} />

        {/* ASSIGN STUDENT */}
        <AssignStudent
          assignForm={assignForm}
          setAssignForm={setAssignForm}
          students={students}
          courses={courses}
          handleAssignStudent={handleAssignStudent}
        />

        {/* STUDENT ATTENDANCE TABLE */}
        <StudentAttendanceTable
          filteredStudents={filteredStudents}
          attendance={attendance}
          toggleAttendance={toggleAttendance}
        />

        {/* SAVE ATTENDANCE */}
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
    </>
  );
};

export default AttendancePage;
