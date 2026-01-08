import { CheckCircle, Clock, XCircle } from "lucide-react";
import Status from "./status";

const AttendanceStatus = ({ attendance }) => {
  if (!attendance)
    return (
      <p className="text-sm text-slate-400">
        Attendance not marked for this day
      </p>
    );

  if (attendance.status === "present")
    return <Status icon={CheckCircle} text="Present" color="emerald" />;

  if (attendance.status === "late")
    return <Status icon={Clock} text="Late" color="amber" />;

  return <Status icon={XCircle} text="Absent" color="rose" />;
};

export default AttendanceStatus;
