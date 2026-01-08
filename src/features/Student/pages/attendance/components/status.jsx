const Status = ({ icon: Icon, text, color }) => (
  <div className={`flex items-center gap-2 text-${color}-700 font-medium`}>
    <Icon size={20} />
    {text}
  </div>
);
export default Status;
