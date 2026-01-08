import { Link } from "react-router-dom";
import { SignInButton } from "./sign-in-btn";

import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";

export default function Form({
  handleSubmit,
  error,
  email,
  setEmail,
  password,
  setPassword,
  togglePasswordVisibility,
  passwordVisible,
  loading,
}) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {error && (
        <p className="bg-red-100 text-red-600 p-2 rounded text-sm">{error}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />

      <div className="border px-4 py-2 flex items-center rounded-md">
        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="flex-1 outline-none"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="ml-2"
        >
          {passwordVisible ? <FaEye /> : <IoMdEyeOff />}
        </button>
      </div>

      <SignInButton loading={loading} />

      <div className="mt-2 text-center">
        <Link to="/auth/forgot-password" className="text-blue-600 text-sm">
          Forgot Password?
        </Link>
      </div>

      <div className="mt-4 text-center border-t pt-4">
        <p className="text-sm text-gray-600 mb-2">
          Don&apos;t have an account?
        </p>
        <Link to="/auth/sign-up" className="text-blue-600 font-medium">
          Create an Account
        </Link>
      </div>
    </form>
  );
}
