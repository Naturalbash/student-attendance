export default function RecentActivity({ data }) {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Recent Activity
      </h3>

      <div className="space-y-3">
        {data.activities.length === 0 && (
          <p className="text-sm text-slate-500">No recent activity</p>
        )}

        {data.activities.map((a) => (
          <div
            key={a.id}
            className="flex justify-between rounded-xl p-3 hover:bg-slate-50"
          >
            <p className="text-sm text-slate-800">{a.action}</p>
            <span className="text-xs text-slate-400">
              {new Date(a.created_at).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
