import { Link } from "react-router-dom";
import { SignUpButton } from "./sign-up-btn";

import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";

export default function Form({
  handleSubmit,
  name,
  setName,
  email,
  setEmail,
  passwordVisible,
  password,
  setPassword,
  togglePasswordVisibility,
  confirmPassword,
  setConfirmPassword,
  role,
  setRole,
  loading,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold text-center mb-4">Create Account</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        className="w-full border px-4 py-2 rounded"
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        className="w-full border px-4 py-2 rounded"
      />

      <div className="border px-4 py-2 flex items-center rounded-md">
        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="flex-1 outline-none"
        />
        <button type="button" onClick={togglePasswordVisibility}>
          {passwordVisible ? <FaEye /> : <IoMdEyeOff />}
        </button>
      </div>

      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type={passwordVisible ? "text" : "password"}
        placeholder="Confirm password"
        className="w-full border px-4 py-2 rounded"
      />

      <div className="mb-4">
        <label className="font-medium block mb-2">Register As</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={role === "student"}
              onChange={() => setRole("student")}
            />
            Student
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />
            Admin
          </label>
        </div>
      </div>

      <SignUpButton loading={loading} />

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/auth/sign-in" className="text-blue-600">
          Sign in
        </Link>
      </p>
    </form>
  );
}
