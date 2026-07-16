import { Calendar } from "lucide-react";

const DatePicker = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <Calendar size={16} className="text-slate-400" />
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border px-3 py-2 text-sm"
    />
  </div>
);
export default DatePicker;
