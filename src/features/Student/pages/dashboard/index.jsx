import { useEffect, useState } from "react";
import { SpinnerDotted } from "spinners-react";
import { BookOpen, TrendingUp, CheckCircle, Activity } from "lucide-react";
import {
  loadStudentDashboard,
  setupDashboardRealtime,
} from "./utils/dashboardActions";
import Stats from "./components/stats";
import CurrentCourse from "./components/current-courses";
import RecentActivity from "./components/recent-activity";

const StudentDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [studentName, setStudentName] = useState("Student");

  const loadDashboardData = async () => {
    setLoading(true);

    const result = await loadStudentDashboard();

    if (result) {
      setStudentName(result.studentName);
      setData(result.dashboardData);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();

    const unsubscribe = setupDashboardRealtime(loadDashboardData);

    return unsubscribe;
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
    <>
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
        <Stats
          totalCourses={totalCourses}
          avgProgress={avgProgress}
          completedProjects={completedProjects}
          attendanceRate={attendanceRate}
        />
        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RECENT ACTIVITY */}
          <RecentActivity data={data} />
          {/* CURRENT COURSES */}
          <CurrentCourse data={data} />
        </div>
      </main>
    </>
  );
};

export default StudentDashboardPage;
