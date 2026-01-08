import { Link } from "react-router-dom";
import {
  Users,
  Clock,
  AlertCircle,
  UserPlus,
  Layers,
  ClipboardCheck,
} from "lucide-react";

const SystemStatus = ({ systemStatus }) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-800">
          System Status
        </h3>

        <div className="flex items-center gap-4 text-slate-500">
          <Link to="/admin/students">
            <UserPlus size={18} />
          </Link>
          <Link to="/admin/courses">
            <Layers size={18} />
          </Link>
          <Link to="/admin/attendance">
            <ClipboardCheck size={18} />
          </Link>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <AlertCircle
            size={16}
            className={
              systemStatus[0].includes("not")
                ? "text-rose-500"
                : "text-emerald-500"
            }
          />
          <span>{systemStatus[0]}</span>
        </div>

        <div className="flex items-start gap-3">
          <Users size={16} className="text-amber-500" />
          <span>{systemStatus[1]}</span>
        </div>

        <div className="flex items-start gap-3">
          <Clock size={16} className="text-slate-400" />
          <span>{systemStatus[2]}</span>
        </div>
      </div>
    </div>
  );
};
export default SystemStatus;
