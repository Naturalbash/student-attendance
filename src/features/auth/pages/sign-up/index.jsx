import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-gradient-to-br from-blue-800 to-purple-500 flex flex-col justify-center items-center text-white p-8">
        <div className="mb-8 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/20 flex items-center rounded-full justify-center">
            <BadgeCheck className="w-60 h-30" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Attendance Management</h2>
          <p className="text-lg text-white/80">
            Create an account to manage attendance
          </p>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center bg-gray-50">
        <form className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create Account
          </h1>

          {/* Name */}
          <div className="mb-3">
            <input
              name="name"
              placeholder="Full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1 outline-none"
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1 outline-none"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <div className="border border-gray-300 px-4 flex justify-between items-center py-2 rounded-md">
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="flex-1 border-none outline-none"
              />
              <button type="button" className="ml-2">
                <IoMdEyeOff />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1 outline-none"
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Register As
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  className="w-4 h-4"
                />
                <span className="ml-1">Student</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  className="w-4 h-4"
                />
                <span className="ml-1">Admin</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Create Account
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/auth/sign-in"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
