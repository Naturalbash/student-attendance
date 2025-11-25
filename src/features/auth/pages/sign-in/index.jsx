import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { BadgeCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

const SignIn = () => {
  const navigate = useNavigate();
  const { login, setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password too short";

    if (!role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    login();

    const userData = {
      id: Math.random().toString(36).slice(2, 9),
      email: email.trim(),
      role,
    };

    setUser(userData, true);

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
          <p className="text-lg text-white/80">
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

          {errors.email && (
            <p className="bg-red-200 text-red-500 p-2 rounded mb-2">
              {errors.email}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md mb-4 outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />

          {errors.password && (
            <p className="text-red-500 mb-2">{errors.password}</p>
          )}

          <div className="border border-gray-300 px-4 flex justify-between items-center py-2 rounded-md mb-5">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 border-none outline-none"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="cursor-pointer ml-2"
            >
              {passwordVisible ? <FaEye /> : <IoMdEyeOff />}
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">
              Login As
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className="w-4 h-4"
                />
                <span>Admin</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="student"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                  className="w-4 h-4"
                />
                <span>Student</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Sign In
          </button>

          <div className="mt-4 text-center">
            <Link
              to="/auth/forgot-password"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="mt-4 text-center border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">Don't have an account?</p>
            <Link
              to="/auth/sign-up"
              className="text-blue-600 hover:text-blue-800 font-medium"
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
