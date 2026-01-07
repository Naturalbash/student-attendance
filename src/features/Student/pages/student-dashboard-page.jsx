import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import { ensureStudentData } from "../../../utils/ensureStudentData";
import { getStudentDashboardData } from "../../../utils/dashboard";
import { SpinnerDotted } from "spinners-react";
import { BookOpen, TrendingUp, CheckCircle, Activity } from "lucide-react";

/* ======================
   STAT CARD
====================== */
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
        <Icon size={26} />
      </div>
    </div>
  </div>
);

/* ======================
   DASHBOARD PAGE
====================== */
const StudentDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [studentName, setStudentName] = useState("Student");

  const loadDashboard = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // ✅ ONLY ADDITION: set student name (safe fallback)
    setStudentName(
      user.user_metadata?.full_name || user.email?.split("@")[0] || "Student"
    );

    await ensureStudentData(user);
    const dashboardData = await getStudentDashboardData(user.id);
    setData(dashboardData);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();

    /* REALTIME SYNC */
    const channel = supabase
      .channel("student-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activity_logs" },
        loadDashboard
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "student_courses" },
        loadDashboard
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "student_projects" },
        loadDashboard
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
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

  const totalCourses = data.courses.length;
  const avgProgress =
    totalCourses > 0
      ? Math.round(
          data.courses.reduce((a, b) => a + b.progress, 0) / totalCourses
        )
      : 0;

  const completedProjects = data.projects.filter(
    (p) => p.progress === 100
  ).length;

  const attendanceRate =
    data.attendance.length > 0
      ? Math.round(
          (data.attendance.filter((a) => a.status === "present").length /
            data.attendance.length) *
            100
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1 text-slate-900">
          Welcome back, {studentName} 👋
        </h1>
        <p className="text-slate-500">
          Here’s a quick overview of your learning progress today.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="My Courses" value={totalCourses} icon={BookOpen} />
        <StatCard
          title="Avg Progress"
          value={`${avgProgress}%`}
          icon={TrendingUp}
        />
        <StatCard
          title="Completed Projects"
          value={completedProjects}
          icon={CheckCircle}
        />
        <StatCard
          title="Attendance"
          value={`${attendanceRate}%`}
          icon={Activity}
        />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Activity
          </h3>

          <div className="space-y-3">
            {data.activities.length === 0 && (
              <p className="text-sm text-slate-500">No recent activity</p>
            )}

            {data.activities.map((a) => (
              <div
                key={a.id}
                className="flex justify-between rounded-xl p-3 hover:bg-slate-50"
              >
                <p className="text-sm text-slate-800">{a.action}</p>
                <span className="text-xs text-slate-400">
                  {new Date(a.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CURRENT COURSES */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-800 mb-4">
            My Courses
          </h3>

          <div className="space-y-3">
            {data.courses.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-slate-200 p-3"
              >
                <p className="font-medium text-slate-800">{c.courses?.name}</p>
                <div className="h-2 bg-slate-200 rounded-full mt-2">
                  <div
                    className="h-2 bg-indigo-600 rounded-full"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {c.progress}% completed
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default StudentDashboardPage;
