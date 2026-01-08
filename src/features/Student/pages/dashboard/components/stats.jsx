import StatCard from "./stats-card";
import { BookOpen, TrendingUp, CheckCircle, Activity } from "lucide-react";

export default function Stats({
  totalCourses,
  avgProgress,
  completedProjects,
  attendanceRate,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        title="My Courses"
        value={totalCourses}
        icon={BookOpen}
        accent="bg-indigo-500"
      />
      <StatCard
        title="Avg Progress"
        value={`${avgProgress}%`}
        icon={TrendingUp}
        accent="bg-emerald-500"
      />
      <StatCard
        title="Completed Projects"
        value={completedProjects}
        icon={CheckCircle}
        accent="bg-amber-500"
      />
      <StatCard
        title="Attendance"
        value={`${attendanceRate}%`}
        icon={Activity}
        accent="bg-rose-500"
      />
    </div>
  );
}
