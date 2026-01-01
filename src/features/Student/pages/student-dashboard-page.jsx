import { CheckCircle, BookOpen, TrendingUp } from "lucide-react";
import { SpinnerDotted } from "spinners-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import { getStudentDashboardData } from "../../../utils/dashboard";
import { ensureStudentData } from "../../../utils/ensureStudentData";

// =======================
// Stat Card Component
// =======================
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-3xl font-semibold text-slate-900 mt-1">
          {value}
          {title === "Attendance" ? "%" : ""}
        </p>
      </div>
      <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

// =======================
// Attendance Overview
// =======================
const AttendanceOverview = ({ attendance }) => {
  const last5 = attendance.slice(0, 5).reverse();
  const days = last5.map((a) => ({
    day: new Date(a.date).toLocaleDateString("en-US", { weekday: "short" }),
    present: a.present,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">
        Weekly Attendance
      </h3>
      <div className="flex items-end justify-between h-48">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-2 w-full">
            <div
              className={`w-8 rounded-lg ${
                d.present ? "bg-indigo-600" : "bg-slate-300"
              } transition`}
              style={{ height: d.present ? "120px" : "40px" }}
            />
            <span className="text-xs text-slate-500">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =======================
// Current Courses
// =======================
const CurrentCourses = ({ courses }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
    <h3 className="text-base font-semibold text-slate-800">My Courses</h3>
    <div className="space-y-3">
      {courses.map((course) => (
        <div
          key={course.id}
          className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
        >
          <p className="font-medium text-slate-800">{course.name}</p>
          <div className="w-32 h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">{course.progress}%</span>
        </div>
      ))}
      {courses.length === 0 && (
        <p className="text-gray-500 text-sm">No courses assigned yet.</p>
      )}
    </div>
  </div>
);

// =======================
// Recent Activity
// =======================
const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
    <h3 className="text-base font-semibold text-slate-800 mb-4">
      Recent Activity
    </h3>
    <div className="space-y-3">
      {activities.map((activity, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl p-3 hover:bg-slate-50"
        >
          <p className="text-sm text-slate-800">{activity.action}</p>
          <span className="text-xs text-slate-400">
            {new Date(activity.created_at).toLocaleDateString()}
          </span>
        </div>
      ))}
      {activities.length === 0 && (
        <p className="text-gray-500 text-sm">No recent activity.</p>
      )}
    </div>
  </div>
);

// =======================
// Student Dashboard Page
// =======================
const StudentDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setDashboard(null);
        setLoading(false);
        return;
      }

      // Auto-create student data if missing
      await ensureStudentData(user.id);

      const data = await getStudentDashboardData(user.id);
      setDashboard(data);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <SpinnerDotted
            size={40}
            thickness={100}
            speed={100}
            color="#4f46e5"
          />
          <p className="text-sm text-slate-500 animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboard) navigate("/auth/sign-in", { replace: true });

  const courses = dashboard?.courses || [];
  const attendance = dashboard?.attendance || [];
  const activities = dashboard?.activities || [];

  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => c.progress === 100).length;
  const attendanceRate =
    attendance.length > 0
      ? Math.round(
          (attendance.filter((a) => a.present).length / attendance.length) * 100
        )
      : 0;

  const stats = [
    { title: "Total Courses", value: totalCourses, icon: BookOpen },
    { title: "Attendance", value: attendanceRate, icon: CheckCircle },
    { title: "Completed Projects", value: completedCourses, icon: TrendingUp },
  ];

  return (
    <main className="min-h-screen w-full bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome Back, {dashboard.profile?.full_name || "Student"}!
        </h1>
        <p className="text-sm text-slate-500">
          Here's a quick overview of your learning progress.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AttendanceOverview attendance={attendance} />
          <RecentActivity activities={activities} />
        </div>
        <div className="space-y-6">
          <CurrentCourses courses={courses} />
        </div>
      </div>
    </main>
  );
};

export default StudentDashboardPage;
