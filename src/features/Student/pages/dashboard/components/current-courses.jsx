export default function CurrentCourse({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">
        My Courses
      </h3>

      <div className="space-y-3">
        {data.courses.map((c) => (
          <div key={c.id} className="rounded-xl border border-slate-200 p-3">
            <p className="font-medium text-slate-800">{c.courses?.name}</p>
            <div className="h-2 bg-slate-200 rounded-full mt-2">
              <div
                className="h-2 bg-indigo-600 rounded-full"
                style={{ width: `${c.progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {c.progress}% completed
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
