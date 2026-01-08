import { Search } from "lucide-react";

export default function SearchField({ search, setSearch }) {
  return (
    <div className="relative max-w-md">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border bg-white py-2 pl-10 pr-4 text-sm"
      />
    </div>
  );
}
