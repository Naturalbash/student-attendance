import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { BadgeCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import signUpAndCreateProfile from "../../../../utils/auth";
import { SignUpButton } from "./sign-up-btn";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Enter your full name");
    if (!email) return setError("Enter your email");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    setLoading(true);

    try {
      const { user, error, needsConfirmation } = await signUpAndCreateProfile({
        email,
        password,
        full_name: name,
        role,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (needsConfirmation) {
        navigate(`/auth/confirm?email=${encodeURIComponent(email)}`, {
          replace: true,
        });
        return;
      }

      if (user) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:flex-1 bg-gradient-to-br from-blue-800 to-purple-500 flex-col justify-center items-center text-white p-8">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
            <BadgeCheck className="w-16 h-16" />
          </div>
          <h2 className="text-4xl font-bold mb-2">Attendance Management</h2>
          <p className="text-white/80">
            Create an account to manage attendance
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold text-center mb-4">
            Create Account
          </h1>

          {error && <p className="text-red-600 text-sm">{error}</p>}

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
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="ml-2"
            >
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
      </div>
    </div>
  );
}
