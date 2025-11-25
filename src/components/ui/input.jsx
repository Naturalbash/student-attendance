export function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-blue-500"
    />
  );
}