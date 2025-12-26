import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { BadgeCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../../../utils/supabase";
import { SignInButton } from "./sign-in-btn";
import { ensureProfileExists } from "../../../../utils/auth";

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const validateForm = () => {
    if (!email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email";
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Password too short";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Sign in
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const user = data.user;
      if (!user) {
        setError("Authentication failed. Have you confirmed your email?");
        return;
      }

      // 2️⃣ Ensure profile exists (CREATE IF MISSING)
      const profile = await ensureProfileExists(user);

      if (!profile) {
        setError("Unable to load user profile");
        return;
      }

      // 3️⃣ Redirect by role
      if (profile.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/student/dashboard", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel hidden on mobile */}
      <div className="hidden md:flex md:flex-1 bg-gradient-to-br from-blue-800 to-purple-500 flex-col justify-center items-center text-white p-8">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/20 flex items-center rounded-full justify-center">
            <BadgeCheck className="w-16 h-16" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Attendance Management</h2>
          <p className="text-lg text-white/80">
            Track your presence, manage your time efficiently
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex justify-center items-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md flex flex-col">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            ATTENDANCE HUB <br /> LOGIN
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {error && (
              <p className="bg-red-100 text-red-600 p-2 rounded text-sm">
                {error}
              </p>
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
              <Link
                to="/auth/forgot-password"
                className="text-blue-600 text-sm"
              >
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
        </div>
      </div>
    </div>
  );
};

export default SignIn;
