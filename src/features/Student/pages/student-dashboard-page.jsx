import {
  Users,
  CheckCircle,
  XCircle,
  BookOpen,
  TrendingUp,
} from "lucide-react";

/* =======================
   MOCK DATA
======================= */
const initialStats = [
  { title: "Total Courses", value: 4, icon: BookOpen },
  { title: "Attendance", value: 90, icon: CheckCircle, change: 5 },
  { title: "Completed Projects", value: 3, icon: TrendingUp },
];

const courses = [
  { id: 1, name: "Web Development", progress: 80 },
  { id: 2, name: "Graphic Design", progress: 60 },
  { id: 3, name: "UI/UX Design", progress: 40 },
  { id: 4, name: "Digital Marketing", progress: 20 },
];

const attendanceData = [80, 95, 85, 90, 88];

const recentActivityData = [
  { id: 1, action: "Completed Web Development Module 1", time: "2 days ago" },
  { id: 2, action: "Marked Present for Monday", time: "3 days ago" },
  { id: 3, action: "Started Graphic Design Module 2", time: "4 days ago" },
];

/* =======================
   COMPONENTS
======================= */
const StatCard = ({ title, value, icon: Icon, change }) => (
  <div className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-3xl font-semibold text-slate-900 mt-1">
          {value}
          {title === "Attendance" ? "%" : ""}
        </p>
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

const CurrentCourses = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
    <h3 className="text-base font-semibold text-slate-800">My Courses</h3>
    <div className="space-y-3">
      {courses.map((course) => (
        <div
          key={course.id}
          className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
        >
          <p className="font-medium text-slate-800">{course.name}</p>
          <div className="w-32 h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-slate-500">{course.progress}%</span>
        </div>
      ))}
    </div>
  </div>
);

const RecentActivity = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
    <h3 className="text-base font-semibold text-slate-800 mb-4">
      Recent Activity
    </h3>
    <div className="space-y-3">
      {recentActivityData.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center justify-between rounded-xl p-3 transition hover:bg-slate-50"
        >
          <p className="text-sm text-slate-800">{activity.action}</p>
          <span className="text-xs text-slate-400">{activity.time}</span>
        </div>
      ))}
    </div>
  </div>
);

/* =======================
   MAIN STUDENT DASHBOARD
======================= */
const StudentDashboardPage = () => {
  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome Back, Student!
        </h1>
        <p className="text-sm text-slate-500">
          Here’s a quick overview of your learning progress.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {initialStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AttendanceOverview />
          <RecentActivity />
        </div>

        <div className="space-y-6">
          <CurrentCourses />
        </div>
      </div>
    </main>
  );
};

export default StudentDashboardPage;
