import { Download } from "lucide-react";

const students = [
  {
    id: 1,
    name: "Mark Henry",
    email: "mark@gmail.com",
    course: "Website Development Application",
    status: "Active",
    attendance: "92%",
  },
  {
    id: 2,
    name: "Joshua Timothy",
    email: "tom@gmail.com",
    course: "Cyber Security",
    status: "Inactive",
    attendance: "62%",
  },
  {
    id: 3,
    name: "Hanafi Taofik",
    email: "taofik1$@gmail.com",
    course: "Graphics Design",
    status: "Active",
    attendance: "84%",
  },
  {
    id: 4,
    name: "Yusuf Maimunah",
    email: "maimu32@gmail.com",
    course: "Website Development Application",
    status: "active",
    attendance: "80%",
  },
  {
    id: 5,
    name: "Tom Brown",
    email: "brown1@outlook.com",
    course: "Graphics Design",
    status: "Active",
    attendance: "83%",
  },
];

const AttendancePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">Attendance Management</h2>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Mark Attendance
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Courses</option>
            <option>Website Development Application</option>
            <option>Graphics Design</option>
            <option>Cyber Security</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">
                  Student
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Course
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Check In
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Check Out
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 5).map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{student.name}</td>
                  <td className="p-4">{student.course}</td>
                  <td className="p-4">09:15 AM</td>
                  <td className="p-4">05:30 PM</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Present
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
