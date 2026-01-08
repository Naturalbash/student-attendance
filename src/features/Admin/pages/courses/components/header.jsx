export default function Header({ search, setSearch }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
      <div>
        <h1 className="text-2xl font-semibold">Programs / Courses</h1>
        <p className="text-sm text-slate-500">Manage courses and syllabus</p>
      </div>

      <div className="relative max-w-md w-full sm:w-auto">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full sm:w-64 rounded-xl border pl-10 pr-4 py-2 text-sm"
        />
      </div>
    </div>
  );
}
