import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export default function SignUp() {
  const { login, setUser } = useAuthStore();

  // Controlled form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");

  // Password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  // Validation errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // Manual validation
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    else if (name.length < 2) newErrors.name = "Too short";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password too short";
    else if (password.length > 30) newErrors.password = "Password too long";

    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm your password";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords must match";

    if (!role) newErrors.role = "Select a role";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    login();

    const userData = {
      id: Math.random().toString(36).slice(2, 10),
      name,
      email,
      role,
    };

    setUser(userData, true);

    if (role === "admin") {
      window.location.href = "/admin/dashboard";
    } else {
      window.location.href = "/student/dashboard";
    }
  };

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
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create Account
          </h1>

          {/* Name */}
          <div className="mb-3">
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className={`w-full px-4 py-2 border rounded-md mb-1 outline-none ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`w-full px-4 py-2 border rounded-md mb-1 outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <div className="border border-gray-300 px-4 flex justify-between items-center py-2 rounded-md">
              <input
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="flex-1 border-none outline-none"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2"
              >
                {passwordVisible ? <FaEye /> : <IoMdEyeOff />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <input
              name="confirmPassword"
              type={passwordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className={`w-full px-4 py-2 border rounded-md mb-1 outline-none ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
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
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                  className="w-4 h-4"
                />
                <span className="ml-1">Student</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className="w-4 h-4"
                />
                <span className="ml-1">Admin</span>
              </label>
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
