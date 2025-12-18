import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  BookOpen,
  PlusCircle,
  X,
  FileText,
  Download,
} from "lucide-react";

/* =======================
   MOCK DATA
======================= */
const initialStats = [
  { title: "Total Students", value: 28, icon: Users, change: 5 },
  { title: "Present Today", value: 22, icon: CheckCircle, change: 2 },
  { title: "Absent Today", value: 6, icon: XCircle, change: -1 },
  { title: "Active Programs", value: 4, icon: BookOpen },
];

const initialRecentActivity = [
  {
    id: 1,
    name: "Ojo Henry",
    action: "Checked In",
    time: "09:15 AM",
    status: "present",
  },
  {
    id: 2,
    name: "Sunday Tobi",
    action: "Checked Out",
    time: "05:30 PM",
    status: "present",
  },
  {
    id: 3,
    name: "Abdullah Mubaraq",
    action: "Checked In",
    time: "09:45 AM",
    status: "present",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    action: "Absent",
    time: "All Day",
    status: "absent",
  },
];

const attendanceData = [80, 95, 85, 90, 88];

const courses = [
  "Web Development",
  "Graphic Design",
  "UI/UX Design",
  "Data Science",
  "Digital Marketing",
];

const mockAttendanceReport = [
  {
    name: "Ojo Henry",
    course: "Web Development",
    present: 25,
    total: 30,
    percentage: 83,
  },
  {
    name: "Sunday Tobi",
    course: "Graphic Design",
    present: 28,
    total: 30,
    percentage: 93,
  },
  {
    name: "Abdullah Mubaraq",
    course: "UI/UX Design",
    present: 22,
    total: 30,
    percentage: 73,
  },
  {
    name: "Sarah Wilson",
    course: "Data Science",
    present: 26,
    total: 30,
    percentage: 87,
  },
];

/* =======================
   COMPONENTS
======================= */

const StatCard = ({ title, value, icon: Icon, change }) => (
  <div className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-3xl font-semibold text-slate-900 mt-1">{value}</p>
        {change !== undefined && (
          <p
            className={`mt-2 flex items-center gap-1 text-xs ${
              change > 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            <TrendingUp size={14} />
            {change > 0 ? "+" : ""}
            {change}% this week
          </p>
        )}
      </div>

      <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

const AttendanceOverview = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
    <h3 className="text-base font-semibold text-slate-800 mb-4">
      Weekly Attendance
    </h3>

    <div className="flex items-end justify-between h-48">
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
        <div key={day} className="flex flex-col items-center gap-2 w-full">
          <div
            className="w-8 rounded-lg bg-gradient-to-t from-indigo-600 to-indigo-300 transition hover:opacity-90"
            style={{ height: `${attendanceData[index]}px` }}
          />
          <span className="text-xs text-slate-500">{day}</span>
        </div>
      ))}
    </div>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold text-slate-800">
        Recent Activity
      </h3>
      <button className="text-xs text-indigo-600 hover:underline">
        View all
      </button>
    </div>

    <div className="space-y-3">
      {activities.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-xl p-3 transition hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                item.status === "present" ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <div>
              <p className="text-sm font-medium text-slate-800">{item.name}</p>
              <p className="text-xs text-slate-500">{item.action}</p>
            </div>
          </div>
          <span className="text-xs text-slate-400">{item.time}</span>
        </div>
      ))}
    </div>
  </div>
);

const QuickActions = ({ onAddStudent, onGenerateReport }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
    <h3 className="text-base font-semibold text-slate-800 mb-4">
      Quick Actions
    </h3>

    <div className="space-y-3">
      <button
        onClick={onAddStudent}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95"
      >
        <PlusCircle size={16} />
        Add Student
      </button>

      <button
        onClick={onGenerateReport}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95"
      >
        <FileText size={16} />
        Generate Report
      </button>
    </div>
  </div>
);

/* =======================
   MODALS
======================= */

const AddStudentModal = ({ isOpen, onClose, onAddStudent }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    enrollmentDate: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add New Student</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X />
          </button>
        </div>

        <div className="space-y-4">
          {["name", "email"].map((field) => (
            <input
              key={field}
              placeholder={field.toUpperCase()}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          ))}

          <select
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          >
            <option value="">Select Program</option>
            {courses.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            value={form.enrollmentDate}
            onChange={(e) =>
              setForm({ ...form, enrollmentDate: e.target.value })
            }
          />

          <button
            onClick={() => {
              onAddStudent(form);
              onClose();
            }}
            className="w-full rounded-xl bg-indigo-600 py-2 text-white transition hover:bg-indigo-700 active:scale-95"
          >
            Add Student
          </button>
        </div>
      </div>
    </div>
  );
};

const ReportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Attendance Report</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="py-2">Student</th>
              <th>Program</th>
              <th>Present</th>
              <th>Total</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {mockAttendanceReport.map((s, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{s.name}</td>
                <td>{s.course}</td>
                <td>{s.present}</td>
                <td>{s.total}</td>
                <td>
                  <span
                    className={`rounded-lg px-2 py-1 text-xs ${
                      s.percentage >= 80
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {s.percentage}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =======================
   MAIN PAGE
======================= */

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(initialStats);
  const [recentActivity, setRecentActivity] = useState(initialRecentActivity);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    setStats(initialStats);
  }, []);

  const handleAddStudent = (student) => {
    setStats((prev) =>
      prev.map((s) =>
        s.title === "Total Students" ? { ...s, value: s.value + 1 } : s
      )
    );

    setRecentActivity((prev) => [
      {
        id: Date.now(),
        name: student.name,
        action: "Enrolled",
        time: "Now",
        status: "present",
      },
      ...prev.slice(0, 3),
    ]);
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AttendanceOverview />
          <RecentActivity activities={recentActivity} />
        </div>

        <QuickActions
          onAddStudent={() => setShowAddStudent(true)}
          onGenerateReport={() => setShowReport(true)}
        />
      </div>

      <AddStudentModal
        isOpen={showAddStudent}
        onClose={() => setShowAddStudent(false)}
        onAddStudent={handleAddStudent}
      />

      <ReportModal isOpen={showReport} onClose={() => setShowReport(false)} />
    </main>
  );
};

export default AdminDashboardPage;
