import { useState, useEffect } from "react";
import { Plus, X, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  fetchStudentsData,
  addStudent,
  updateStudent,
  deleteStudent,
} from "./utils/studentActions";
import StudentTable from "./components/students-table";

const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchStudentsData();
      setStudents(data.students);
      setCourses(data.courses);
    } catch (error) {
      console.error("Failed to load students data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddStudent = async ({ name, email, courseIds }) => {
    try {
      await addStudent(name, email, courseIds, courses);
      await loadData();
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to add student:", error);
      alert(error.message);
    }
  };

  const handleEditStudent = async ({ name, courseIds }) => {
    try {
      await updateStudent(editTarget.id, name, courseIds, courses);
      await loadData();
      setEditTarget(null);
    } catch (error) {
      console.error("Failed to edit student:", error);
      alert("Failed to update student");
    }
  };

  const handleDeleteStudent = async () => {
    try {
      await deleteStudent(deleteTarget.id, deleteTarget.full_name);
      await loadData();
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Failed to delete student");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Students</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 shadow"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <StudentTable
          students={students}
          setEditTarget={setEditTarget}
          setDeleteTarget={setDeleteTarget}
        />
      )}

      <StudentModal
        open={modalOpen || !!editTarget}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        onSubmit={editTarget ? handleEditStudent : handleAddStudent}
        courses={courses}
        initial={editTarget}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Student"
        message="This will remove the student from the system. Continue?"
        onConfirm={handleDeleteStudent}
        onClose={() => setDeleteTarget(null)}
      />
    </main>
  );
};

export default AdminStudentsPage;
