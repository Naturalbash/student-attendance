import { useState, useEffect } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { BadgeCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../../../utils/supabase";
import signUpAndCreateProfile from "../../../../utils/auth";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if logged in
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || session?.user) {
        navigate("/", { replace: true });
      }
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, [navigate]);

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
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-gradient-to-br from-blue-800 to-purple-500 flex items-center justify-center text-white">
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

      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-6 rounded-lg shadow"
        >
          <h1 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h1>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full border px-4 py-2 rounded mb-3"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded mb-3"
          />

          <div className="border px-4 py-2 rounded flex items-center mb-3">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="flex-1 outline-none"
            />
            <IoMdEyeOff />
          </div>

          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm password"
            className="w-full border px-4 py-2 rounded mb-4"
          />

          <div className="mb-6">
            <label className="font-medium block mb-2">Register As</label>
            <div className="flex gap-6">
              <label className="flex gap-2 items-center">
                <input
                  type="radio"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                />
                Student
              </label>

              <label className="flex gap-2 items-center">
                <input
                  type="radio"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                />
                Admin
              </label>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

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
