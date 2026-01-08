export default function AddCourse({
  newCourseName,
  setNewCourseName,
  newCourseDescription,
  setNewCourseDescription,
  handleAddCourse,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-md space-y-3">
      <input
        value={newCourseName}
        onChange={(e) => setNewCourseName(e.target.value)}
        placeholder="Course name"
        className="w-full rounded-xl border px-4 py-2 text-sm"
      />
      <textarea
        rows={3}
        value={newCourseDescription}
        onChange={(e) => setNewCourseDescription(e.target.value)}
        placeholder="Course description (optional)"
        className="w-full rounded-xl border px-4 py-2 text-sm resize-none"
      />
      <button
        onClick={handleAddCourse}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm"
      >
        <PlusCircle size={16} /> Add Course
      </button>
    </div>
  );
}
