import React from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";

const StudentsPage = () => {
  const students = [
    {
      id: 1,
      name: "Ojo Henry",
      email: "henry@gmail.com",
      course: "Website Development Application",
      status: "Active",
      attendance: "92%",
    },
    {
      id: 2,
      name: "Sunday Tobi",
      email: "tobi@gmail.com",
      course: "Graphics Design",
      status: "Active",
      attendance: "88%",
    },
    {
      id: 3,
      name: "Abdullah Mubaraq",
      email: "mike@gmail.com",
      course: "Cybersecurity",
      status: "Active",
      attendance: "95%",
    },
    {
      id: 4,
      name: "David George",
      email: "sarah@gmail.com",
      course: "Website Development Application",
      status: "Inactive",
      attendance: "76%",
    },
    {
      id: 5,
      name: "Tajudeen Malik",
      email: "tom@gmail.com",
      course: "Graphics Design",
      status: "Active",
      attendance: "84%",
    },
    {
      id: 6,
      name: "Tom Brown",
      email: "brown1@outlook.com",
      course: "Graphics Design",
      status: "Active",
      attendance: "83%",
    },
    {
      id: 7,
      name: "Yusuf Maimunah",
      email: "Maimunah32@gmail.com",
      course: "Website Development Application",
      status: "Active",
      attendance: "80%",
    },
    {
      id: 8,
      name: "Joshua Timothy",
      email: "tom@gmail.com",
      course: "Cyber Security",
      status: "Inactive",
      attendance: "62%",
    },
    {
      id: 9,
      name: "Andrew Chase",
      email: "chase12@gmail.com",
      course: "Graphics Design",
      status: "Active",
      attendance: "84%",
    },
    {
      id: 10,
      name: "Grace Ajao",
      email: "aj@gmail.com",
      course: "Cyber Security",
      status: "Active",
      attendance: "87%",
    },
    {
      id: 11,
      name: "Hanafi Taofik",
      email: "taofik1$@gmail.com",
      course: "Graphics Design",
      status: "Active",
      attendance: "84%",
    },
    {
      id: 12,
      name: "James Goodie",
      email: "Jay@gmail.com",
      course: "Graphics Design",
      status: "Active",
      attendance: "83%",
    },
    {
      id: 13,
      name: "Moshood Fathia",
      email: "mofat@gmail.com",
      course: "Cyber Security",
      status: "Active",
      attendance: "79%",
    },
    {
      id: 14,
      name: "Gabriel Vin",
      email: "vin@gmail.com",
      course: "Cyber Security",
      status: "Active",
      attendance: "84%",
    },
    {
      id: 15,
      name: "Ifeoma Ijaw",
      email: "ij2@gmail.com",
      course: "Graphics Design",
      status: "Active",
      attendance: "84%",
    },
    {
      id: 16,
      name: "AbdulAkeem Aduagba",
      email: "ak3@gmail.com",
      course: "Website Development Application",
      status: "Active",
      attendance: "86%",
    },
    {
      id: 17,
      name: "Mukthar Aluko",
      email: "mal@gmail.com",
      course: "Website Development Application",
      status: "Active",
      attendance: "89%",
    },
    {
      id: 18,
      name: "AbdulBasit Ori",
      email: "ori@gmail.com",
      course: "Cyber Security",
      status: "Active",
      attendance: "84%",
    },
    {
      id: 19,
      name: "Mato Jerry",
      email: "maj@gmail.com",
      course: "Website Development Application",
      status: "Active",
      attendance: "83%",
    },
    {
      id: 20,
      name: "Friday John",
      email: "jHg322@gmail.com",
      course: "Website Application Development",
      status: "Active",
      attendance: "84%",
    },
    {
      id: 21,
      name: "Mohammed Amin",
      email: "amin@gmail.com",
      course: "Graphics Design",
      status: "Active",
      attendance: "84%",
    },
    {
      id: 22,
      name: "Nakamura Shittu",
      email: "Angl@gmail.com",
      course: "Cyber Security",
      status: "Inactive",
      attendance: "64%",
    },
    {
      id: 23,
      name: "Ademola Tunji",
      email: "tade@gmail.com",
      course: "Graphics Design",
      status: "Active",
      attendance: "84%",
    },
    {
      id: 24,
      name: "Steven Jay",
      email: "jay@gmail.com",
      course: "Website Development Application",
      status: "Inactive",
      attendance: "54%",
    },
    {
      id: 25,
      name: "Junior Praise",
      email: "Prajun@gmail.com",
      course: "Graphics Design",
      status: "Active",
      attendance: "87%",
    },
    {
      id: 26,
      name: "Ahmed Kayode",
      email: "ahmk@gmail.com",
      course: "Cyber Security",
      status: "Active",
      attendance: "84%",
    },
    {
      id: 27,
      name: "Owonikoko Sharaf",
      email: "koko@gmail.com",
      course: "Graphics Design",
      status: "Active",
      attendance: "85%",
    },
    {
      id: 28,
      name: "Kudirat Atinuke",
      email: "hableem@gmail.com",
      course: "Website Development Application",
      status: "Active",
      attendance: "84%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col  items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Students</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">
                  Name
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Email
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Course
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Attendance
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{student.name}</td>
                  <td className="p-4 text-gray-600">{student.email}</td>
                  <td className="p-4">{student.course}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4">{student.attendance}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {/* <button className="text-blue-600 hover:text-blue-800"> */}
                        {/* <Eye className="w-4 h-4" /> */}
                      {/* </button> */}
                      <button className="text-gray-600 hover:text-gray-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      {/* <button className="text-red-600 hover:text-red-800"> */}
                        {/* <Trash2 className="w-4 h-4" /> */}
                      {/* </button> */}
                    </div>
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

export default StudentsPage;
