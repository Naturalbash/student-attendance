import { useEffect, useState } from "react";
import supabase from "../../../../utils/supabase";
import { SpinnerDotted } from "spinners-react";
import { Users, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchDashboardData } from "./utils/fetchDashboardData";
import SystemStatus from "./components/system-status";

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchDashboardData();
      setStats(data.stats);
      setActivities(data.activities);
      setSystemStatus(data.systemStatus);
      setLoading(false);
    };
    loadData();

    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_logs" },
        async () => {
          const data = await fetchDashboardData();
          setStats(data.stats);
          setActivities(data.activities);
          setSystemStatus(data.systemStatus);
        }
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
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Overview of students, courses and today’s attendance
        </p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
      </div>
      <SystemStatus systemStatus={systemStatus} />
    </main>
  );
};

export default AdminDashboardPage;
