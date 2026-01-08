const Stat = ({ label, value, color = "slate" }) => (
  <div className="bg-slate-50 rounded-xl p-4">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`text-xl font-semibold text-${color}-600`}>{value}</p>
  </div>
);
export default Stat;
