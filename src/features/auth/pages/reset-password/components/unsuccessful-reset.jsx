export default function ResetUnsuccessful({
  error,
  handleSubmit,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
}) {
  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Reset Your Password
      </h2>
      {error && (
        <p className="bg-red-100 text-red-600 p-2 rounded text-sm mb-4">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors font-medium disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </>
  );
}
