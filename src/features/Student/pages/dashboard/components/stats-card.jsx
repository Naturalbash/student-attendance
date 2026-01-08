const StatCard = ({ title, value, icon: Icon, accent }) => (
  <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-lg transition">
    <div className={`absolute right-0 top-0 h-full w-1 ${accent}`} />
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-3 text-slate-700">
        <Icon size={26} />
      </div>
    </div>
  </div>
);
export default StatCard;
