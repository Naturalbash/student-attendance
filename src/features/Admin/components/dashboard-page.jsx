import {
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";

const stats = {
  totalStudents: 28,
  presentToday: 22,
  absentToday: 6,
  attendanceRate: 78.6,
};

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
  {
    id: 5,
    name: "Tajudeen Malik",
    action: "Checked In",
    time: "08:30 AM",
    status: "present",
  },
];

// subcomponents moved to top-level
const StatsCard = ({ title, value, icon: Icon, color, change }) => (
  <div className="bg-white p-6 rounded-lg shadow-md justify-center">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change !== undefined && (
          <p
            className={`text-sm ${
              change > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change > 0 ? "+" : ""}
            {change}% from last week
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const RecentActivity = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      <button className="text-blue-600 hover:text-blue-800">View All</button>
    </div>
    <div className="space-y-4">
      {recentActivity.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-3 ${
                activity.status === "present" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <div>
              <p className="font-medium">{activity.name}</p>
              <p className="text-sm text-gray-600">{activity.action}</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">{activity.time}</span>
        </div>
      ))}
    </div>
  </div>
);

const AttendanceChart = () => (
  <div className="bg-white p-6 rounded-lg shadow-md mt-3">
    <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
    <div className="h-64 flex items-end justify-center space-x-4">
      <div className="flex flex-col items-center">
        <div
          className="w-12 bg-green-500 rounded-t"
          style={{ height: "120px" }}
        />
        <span className="text-sm mt-2">Mon</span>
      </div>
      <div className="flex flex-col items-center">
        <div
          className="w-12 bg-green-500 rounded-t"
          style={{ height: "140px" }}
        />
        <span className="text-sm mt-2">Tue</span>
      </div>
      <div className="flex flex-col items-center">
        <div
          className="w-12 bg-green-500 rounded-t"
          style={{ height: "110px" }}
        />
        <span className="text-sm mt-2">Wed</span>
      </div>
      <div className="flex flex-col items-center">
        <div
          className="w-12 bg-green-500 rounded-t"
          style={{ height: "130px" }}
        />
        <span className="text-sm mt-2">Thu</span>
      </div>
      <div className="flex flex-col items-center">
        <div
          className="w-12 bg-green-500 rounded-t"
          style={{ height: "125px" }}
        />
        <span className="text-sm mt-2">Fri</span>
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  return (
    <div className="flex w-full">
      <main className="flex-1">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              color="bg-blue-500"
              change={5}
            />
            <StatsCard
              title="Present Today"
              value={stats.presentToday}
              icon={CheckCircle}
              color="bg-green-500"
              change={2}
            />
            <StatsCard
              title="Absent Today"
              value={stats.absentToday}
              icon={XCircle}
              color="bg-red-500"
              change={-1}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <AttendanceChart />
              <RecentActivity />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-3">
              <p className="text-lg font-semibold mb-4">Attendance Rate</p>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.attendanceRate}%
                </div>
                <p className="text-gray-600">This Month</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stats.attendanceRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
