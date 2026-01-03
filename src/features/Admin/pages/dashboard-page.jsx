import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import { SpinnerDotted } from "spinners-react";
import {
  Users,
  CheckCircle,
  XCircle,
  BookOpen,
  Activity,
  UserPlus,
  ClipboardCheck,
  Layers,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, accent }) => (
  <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-lg transition">
    <div className={`absolute right-0 top-0 h-full w-1 ${accent}`} />
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-3 text-slate-700">
        <Icon size={26} />
      </div>
    </div>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
        <Activity size={18} /> Recent Activity
      </h3>
    </div>

    <div className="space-y-3">
      {activities.length === 0 && (
        <p className="text-sm text-slate-500">No recent activity</p>
      )}

      {activities.map((item) => (
        <div
          key={item.id}
          className="flex items-start justify-between rounded-xl p-3 hover:bg-slate-50 transition"
        >
          <div>
            <p className="text-sm font-medium text-slate-800">
              {item.user_name || "System"}
            </p>
            <p className="text-xs text-slate-500">{item.action}</p>
          </div>
          <span className="text-xs text-slate-400">
            {new Date(item.created_at).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    students: 0,
    present: 0,
    absent: 0,
    courses: 0,
  });

  const [activities, setActivities] = useState([]);
  const [systemStatus, setSystemStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);

    const today = new Date().toISOString().split("T")[0];

    /* STUDENTS */
    const { data: students, count: studentCount } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("role", "student");

    /* COURSES */
    const { count: courseCount } = await supabase
      .from("courses")
      .select("id", { count: "exact", head: true });

    /* ATTENDANCE TODAY */
    const { data: attendanceToday } = await supabase
      .from("attendance")
      .select("status")
      .eq("attendance_date", today);

    const presentToday =
      attendanceToday?.filter((a) => a.status === "present").length || 0;

    const absentToday =
      attendanceToday?.filter((a) => a.status === "absent").length || 0;

    /* UNASSIGNED STUDENTS */
    const { data: assigned } = await supabase
      .from("student_courses")
      .select("student_id");

    const assignedIds = new Set(assigned?.map((a) => a.student_id));
    const unassignedCount =
      students?.filter((s) => !assignedIds.has(s.id)).length || 0;

    /* ACTIVITY LOGS */
    const { data: recentActivities } = await supabase
      .from("activity_logs")
      .select("id, user_name, action, created_at")
      .order("created_at", { ascending: false })
      .limit(6);

    /* LAST ATTENDANCE FROM LOG */
    const lastAttendanceLog = recentActivities?.find((a) =>
      a.action.toLowerCase().includes("attendance")
    );

    const attendanceMarkedToday =
      lastAttendanceLog &&
      new Date(lastAttendanceLog.created_at).toISOString().split("T")[0] ===
        today;

    setStats({
      students: studentCount || 0,
      present: presentToday,
      absent: absentToday,
      courses: courseCount || 0,
    });

    setSystemStatus([
      attendanceMarkedToday
        ? "Attendance marked today"
        : "Attendance not marked today",
      `${unassignedCount} students not assigned to any course`,
      lastAttendanceLog
        ? `Last attendance marked at ${new Date(
            lastAttendanceLog.created_at
          ).toLocaleTimeString()}`
        : "No attendance has been marked yet",
    ]);

    setActivities(recentActivities || []);
    setLoading(false);
  };

  /* REALTIME LISTENER */
  useEffect(() => {
    fetchDashboardData();

    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_logs" },
        () => fetchDashboardData()
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

  return (
    <main className="min-h-screen bg-slate-50 p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Overview of students, courses and today’s attendance
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.students}
          icon={Users}
          accent="bg-indigo-500"
        />
        <StatCard
          title="Present Today"
          value={stats.present}
          icon={CheckCircle}
          accent="bg-emerald-500"
        />
        <StatCard
          title="Absent Today"
          value={stats.absent}
          icon={XCircle}
          accent="bg-rose-500"
        />
        <StatCard
          title="Active Courses"
          value={stats.courses}
          icon={BookOpen}
          accent="bg-amber-500"
        />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">
              System Status
            </h3>

            <div className="flex items-center gap-4 text-slate-500">
              <Link to="/admin/students">
                <UserPlus size={18} />
              </Link>
              <Link to="/admin/courses">
                <Layers size={18} />
              </Link>
              <Link to="/admin/attendance">
                <ClipboardCheck size={18} />
              </Link>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={16}
                className={
                  systemStatus[0].includes("not")
                    ? "text-rose-500"
                    : "text-emerald-500"
                }
              />
              <span>{systemStatus[0]}</span>
            </div>

            <div className="flex items-start gap-3">
              <Users size={16} className="text-amber-500" />
              <span>{systemStatus[1]}</span>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={16} className="text-slate-400" />
              <span>{systemStatus[2]}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
