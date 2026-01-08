import { Activity } from "lucide-react";

const RecentActivity = ({ activities }) => (
  <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
        <Activity size={18} /> Recent Activity
      </h3>
    </div>

    <div className="space-y-3">
      {activities.length === 0 && (
        <p className="text-sm text-slate-500">No recent activity</p>
      )}

      {activities.map((item) => (
        <div
          key={item.id}
          className="flex items-start justify-between rounded-xl p-3 hover:bg-slate-50 transition"
        >
          <div>
            <p className="text-sm font-medium text-slate-800">
              {item.user_name || "System"}
            </p>
            <p className="text-xs text-slate-500">{item.action}</p>
          </div>
          <span className="text-xs text-slate-400">
            {new Date(item.created_at).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  </div>
);
export default RecentActivity;
