import { useState } from "react";
import { FileText, Download } from "lucide-react";

/* =======================
   MOCK DATA
======================= */
const studentReports = [
  {
    course: "Web Development",
    attendance: 85,
    progress: 60,
    grade: "B+",
  },
  {
    course: "Graphic Design",
    attendance: 92,
    progress: 75,
    grade: "A",
  },
  {
    course: "UI/UX Design",
    attendance: 78,
    progress: 40,
    grade: "B",
  },
  {
    course: "Data Science",
    attendance: 88,
    progress: 55,
    grade: "B+",
  },
];

/* =======================
   COMPONENTS
======================= */
const ReportCard = ({ report }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-lg transition">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-slate-900">{report.course}</h3>
      <span
        className={`text-sm font-medium px-2 py-1 rounded-full ${
          report.progress === 100
            ? "bg-emerald-100 text-emerald-700"
            : "bg-indigo-100 text-indigo-700"
        }`}
      >
        {report.progress}% Complete
      </span>
    </div>
    <div className="flex flex-col gap-2 text-sm text-slate-600 mb-3">
      <div className="flex justify-between">
        <span>Attendance</span>
        <span>{report.attendance}%</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full">
        <div
          className={`h-2 rounded-full ${
            report.attendance >= 90
              ? "bg-emerald-600"
              : report.attendance >= 70
              ? "bg-yellow-500"
              : "bg-rose-500"
          }`}
          style={{ width: `${report.attendance}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span>Grade</span>
        <span className="font-medium text-slate-800">{report.grade}</span>
      </div>
    </div>

    <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 transition active:scale-95">
      <Download size={16} />
      Download Report
    </button>
  </div>
);

/* =======================
   MAIN PAGE
======================= */
const StudentReportsPage = () => {
  const [reports] = useState(studentReports);
  const [search, setSearch] = useState("");

  const filteredReports = reports.filter(
    (r) =>
      r.course.toLowerCase().includes(search.toLowerCase()) ||
      r.grade.toLowerCase().includes(search.toLowerCase())
  );

  const totalCourses = reports.length;
  const completedCourses = reports.filter((r) => r.progress === 100).length;
  const averageAttendance = Math.round(
    reports.reduce((acc, r) => acc + r.attendance, 0) / totalCourses
  );

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Reports</h1>
          <p className="text-sm text-slate-500">
            View your course performance and attendance
          </p>
        </div>

        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Courses</p>
          <p className="text-2xl font-semibold text-slate-900">
            {totalCourses}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Completed Courses</p>
          <p className="text-2xl font-semibold text-emerald-600">
            {completedCourses}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Average Attendance</p>
          <p className="text-2xl font-semibold text-indigo-600">
            {averageAttendance}%
          </p>
        </div>
      </div>

      {/* REPORTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report, i) => (
          <ReportCard key={i} report={report} />
        ))}
        {filteredReports.length === 0 && (
          <p className="text-slate-500 col-span-full text-center">
            No reports found.
          </p>
        )}
      </div>
    </main>
  );
};

export default StudentReportsPage;
