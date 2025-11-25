export function Label({ children, htmlFor, ...props }) {
  return (
    <label htmlFor={htmlFor} {...props} className="text-gray-700 font-medium">
      {children}
    </label>
  );
}
