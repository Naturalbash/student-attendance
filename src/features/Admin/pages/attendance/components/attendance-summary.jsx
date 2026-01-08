export default function AttendanceSummary({ students, presentCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-4 border shadow-sm">
        <p className="text-sm text-slate-500">Total Students</p>
        <p className="text-2xl font-semibold">{students.length}</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border shadow-sm">
        <p className="text-sm text-slate-500">Present</p>
        <p className="text-2xl font-semibold text-emerald-600">
          {presentCount}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 border shadow-sm">
        <p className="text-sm text-slate-500">Absent</p>
        <p className="text-2xl font-semibold text-rose-600">
          {students.length - presentCount}
        </p>
      </div>
    </div>
  );
}
