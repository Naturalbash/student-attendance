import { Plus, Edit } from "lucide-react";

const CoursesPage = () => {
  const courses = [
    {
      id: 1,
      name: "Website Development Application",
      students: 12,
      instructor: "Hanafi Taofik",
      duration: "12 weeks",
      status: "Active",
    },
    {
      id: 2,
      name: "Graphics Design",
      students: 8,
      instructor: "Tayo Lawal",
      duration: "10 weeks",
      status: "Active",
    },
    {
      id: 3,
      name: "Cyber Security",
      students: 8,
      instructor: "James Ige",
      duration: "16 weeks",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">Courses</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{course.name}</h3>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {course.status}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                Instructor: {course.instructor}
              </p>
              <p className="text-sm text-gray-600">
                Duration: {course.duration}
              </p>
              <p className="text-sm text-gray-600">
                Students: {course.students}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                View Details
              </button>
              <Edit className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
