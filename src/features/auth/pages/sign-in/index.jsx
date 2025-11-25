import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { BadgeCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

const SignIn = () => {
  const navigate = useNavigate();
  const { login, setUser } = useAuthStore();

  // Controlled inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  // Password visibility toggle
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  // Validation errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    role: "",
  });

  // Manual validation (simple)
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password too short";
    else if (password.length > 50) newErrors.password = "Password too long";

    if (!role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler: accept any email/password and route to selected role dashboard
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // set loading flag in store (if implemented)
    login();

    // create a minimal user object and persist via setUser (will mark isAuth true)
    const userData = {
      id: Math.random().toString(36).slice(2, 9),
      email: email.trim(),
      role,
    };

    setUser(userData, true);

    // navigate to the appropriate dashboard route used in your app
    if (role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/student/dashboard", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Intro Panel */}
      <div className="flex-1 bg-gradient-to-br from-blue-800 to-purple-500 flex flex-col justify-center items-center text-white p-8">
        <div className="mb-8 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/20 flex items-center rounded-full justify-center">
            <BadgeCheck className="w-60 h-30" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Attendance Management</h2>
          <p className="text-4x1 text-blue-150 mb-8">
            Track your presence, manage your time efficiently
          </p>
        </div>
      </div>

      {/* Right - Sign In Form */}
      <div className="flex-1 flex justify-center items-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            ATTENDANCE HUB <br /> LOGIN
          </h1>

          {/* Email errors */}
          {errors.email && (
            <p className="bg-red-200 text-red-500 p-2 rounded mb-2">
              {errors.email}
            </p>
          )}

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md mb-4 outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />

          {/* Password errors */}
          {errors.password && (
            <p className="text-red-500 mb-2">{errors.password}</p>
          )}

          {/* Password */}
          <div className="border border-gray-300 px-4 flex justify-between items-center py-2 rounded-md mb-5">
            <input
              name="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 border-none outline-none"
            />
            <button
              type="button"
              className="cursor-pointer ml-2"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEye /> : <IoMdEyeOff />}
            </button>
          </div>

          {/* Role selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">
              Login As
            </label>

            <div className="flex gap-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                  className="w-4 h-4 cursor-pointer"
                  id="role-student"
                />
                <label
                  htmlFor="role-student"
                  className="ml-2 text-gray-700 cursor-pointer"
                >
                  Student
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className="w-4 h-4 cursor-pointer"
                  id="role-admin"
                />
                <label
                  htmlFor="role-admin"
                  className="ml-2 text-gray-700 cursor-pointer"
                >
                  Admin
                </label>
              </div>
            </div>

            {errors.role && (
              <p className="text-red-500 text-sm mt-2">{errors.role}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Sign In
          </button>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <Link
              to="/auth/forgot-password"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Create Account */}
          <div className="mt-4 text-center border-t pt-4">
            <p className="text-gray-600 text-sm mb-2">Don't have an account?</p>
            <Link
              to="/auth/sign-up"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Create an Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
