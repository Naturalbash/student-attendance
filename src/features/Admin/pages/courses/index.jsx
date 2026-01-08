import { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  Users,
  Save,
  Edit,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  fetchSyllabus,
  addSyllabusTopic,
} from "./utils/courseActions";
import Header from "./components/header";
import AddCourse from "./components/add-course";
import CoursesTable from "./components/courses-table";
import ConfirmModal from "./components/confirm-modal";
import SearchField from "../attendance/components/search-field";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [newSyllabus, setNewSyllabus] = useState("");

  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  /* =======================
     ADD COURSE
  ======================= */
  const handleAddCourse = async () => {
    if (!newCourseName.trim()) {
      toast.error("Course name is required");
      return;
    }

    try {
      await addCourse(newCourseName, newCourseDescription);
      await loadCourses();
      setNewCourseName("");
      setNewCourseDescription("");
      toast.success("Course created successfully");
    } catch (error) {
      console.error("Failed to create course:", error);
      toast.error("Failed to create course");
    }
  };

  /* =======================
     EDIT COURSE
  ======================= */
  const handleEdit = (course) => {
    setEditingId(course.id);
    setEditName(course.name);
    setEditDescription(course.description || "");
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error("Course name cannot be empty");
      return;
    }

    try {
      await updateCourse(editingId, editName, editDescription);
      await loadCourses();
      toast.success("Course updated");
      setEditingId(null);
      setEditName("");
      setEditDescription("");
    } catch (error) {
      console.error("Failed to update course:", error);
      toast.error("Failed to update course");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  /* =======================
     DELETE COURSE
  ======================= */
  const handleDelete = (course) => {
    setDeleteTarget(course);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteCourse(deleteTarget.id, deleteTarget.name);
      await loadCourses(); // Reload to ensure accurate student counts
      toast.success("Course deleted");
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete course:", error);
      toast.error("Failed to delete course");
    }
  };

  const toggleExpand = async (course) => {
    if (expandedCourseId === course.id) {
      setExpandedCourseId(null);
      return;
    }

    setExpandedCourseId(course.id);

    try {
      const data = await fetchSyllabus(course.id);
      setSyllabus(data);
    } catch (error) {
      console.error("Failed to load syllabus:", error);
    }
  };

  const addSyllabus = async (courseId) => {
    if (!newSyllabus.trim()) return;

    try {
      const newTopic = await addSyllabusTopic(courseId, newSyllabus);
      setSyllabus((prev) => [...prev, newTopic]);
      setNewSyllabus("");
      toast.success("Syllabus topic added");
    } catch (error) {
      console.error("Failed to add syllabus topic:", error);
      toast.error("Failed to add syllabus topic");
    }
  };

  /* =======================
     SKELETON LOADER
  ======================= */
  const renderSkeleton = () => (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={i} className="border-b">
          <td className="px-4 py-3">
            <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
          </td>
          <td className="px-4 py-3 text-slate-500 flex items-center gap-1 justify-end">
            <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
          </td>
          <td className="px-4 py-3 text-right">
            <div className="h-4 bg-slate-200 rounded w-1/3 ml-auto animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6 space-y-6">
      <Toaster position="top-right" reverseOrder={false} />

      {/* HEADER */}
      <Header search={search} setSearch={setSearch} />
      {/* ADD COURSE */}
      <AddCourse
        newCourseName={newCourseName}
        setNewCourseName={setNewCourseName}
        newCourseDescription={newCourseDescription}
        setNewCourseDescription={setNewCourseDescription}
        handleAddCourse={handleAddCourse}
      />
      {/* COURSES TABLE */}
      <CoursesTable
        loading={loading}
        filteredCourses={filteredCourses}
        editingId={editingId}
        editName={editName}
        setEditName={setEditName}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        expandedCourseId={expandedCourseId}
        toggleExpand={toggleExpand}
        syllabus={syllabus}
        newSyllabus={newSyllabus}
        setNewSyllabus={setNewSyllabus}
        addSyllabus={addSyllabus}
        renderSkeleton={renderSkeleton}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Course"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </main>
  );
};

export default CoursesPage;
