import {
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  BookOpen,
  PlusCircle,
} from "lucide-react";

/* =======================
   MOCK DATA (replace later with API)
======================= */
const stats = [
  {
    title: "Total Students",
    value: 28,
    icon: Users,
    color: "bg-blue-500",
    change: 5,
  },
  {
    title: "Present Today",
    value: 22,
    icon: CheckCircle,
    color: "bg-green-500",
    change: 2,
  },
  {
    title: "Absent Today",
    value: 6,
    icon: XCircle,
    color: "bg-red-500",
    change: -1,
  },
  {
    title: "Active Courses",
    value: 4,
    icon: BookOpen,
    color: "bg-purple-500",
  },
];

const recentActivity = [
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

/* =======================
   REUSABLE COMPONENTS
======================= */

const StatCard = ({ title, value, icon: Icon, color, change }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>

        {change !== undefined && (
          <p
            className={`text-xs mt-1 ${
              change > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change > 0 ? "+" : ""}
            {change}% from last week
          </p>
        )}
      </div>

      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

const RecentActivity = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

    <div className="space-y-3">
      {recentActivity.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                item.status === "present" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <div>
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-gray-500">{item.action}</p>
            </div>
          </div>

          <span className="text-xs text-gray-400">{item.time}</span>
        </div>
      ))}
    </div>
  </div>
);

const AttendanceOverview = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>

    <div className="flex items-end justify-between h-48">
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
        <div key={day} className="flex flex-col items-center gap-2">
          <div
            className="w-10 bg-green-500 rounded-md"
            style={{ height: `${80 + index * 15}px` }}
          />
          <span className="text-xs text-gray-500">{day}</span>
        </div>
      ))}
    </div>
  </div>
);

const QuickActions = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

    <div className="grid grid-cols-2 gap-3">
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        <PlusCircle size={16} />
        Add Student
      </button>

      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
        <TrendingUp size={16} />
        Generate Report
      </button>
    </div>
  </div>
);

/* =======================
   MAIN PAGE
======================= */
const AdminDashboardPage = () => {
  return (
    <main className="p-6 space-y-6 w-full">
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
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
          <QuickActions />
        </div>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
