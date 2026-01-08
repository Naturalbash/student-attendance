const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
    <h2 className="text-lg font-semibold">{title}</h2>
    {children}
  </div>
);
export default Section;
