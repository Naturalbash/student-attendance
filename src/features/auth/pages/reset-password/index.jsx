import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../../utils/supabase";
import ResetUnsuccessful from "./components/unsuccessful-reset";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the access_token in URL hash (for password reset)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (accessToken && refreshToken) {
      // Set the session
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError("Failed to update password. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate("/auth/sign-in", { replace: true });
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {!success ? (
          <ResetUnsuccessful
            error={error}
            handleSubmit={handleSubmit}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            loading={loading}
          />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Password Updated!
            </h2>
            <p className="text-gray-600 mb-4">
              Your password has been successfully updated. Redirecting to sign
              in...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
