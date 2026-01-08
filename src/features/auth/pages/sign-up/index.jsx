import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import signUpAndCreateProfile from "../../../../utils/auth";
import toast from "react-hot-toast";
import Form from "./components/form";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return toast.error("Enter your full name");
    if (!email) return toast.error("Enter your email");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);

    try {
      const { user, error, needsConfirmation } = await signUpAndCreateProfile({
        email,
        password,
        full_name: name,
        role,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (needsConfirmation) {
        toast.success("Account created! Check your email to confirm.");
        navigate(`/auth/confirm?email=${encodeURIComponent(email)}`, {
          replace: true,
        });
        return;
      }

      if (user) {
        toast.success("Account created successfully 🎉");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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
        <Form
          handleSubmit={handleSubmit}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          passwordVisible={passwordVisible}
          password={password}
          setPassword={setPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          role={role}
          setRole={setRole}
          loading={loading}
        />
      </div>
    </div>
  );
}
