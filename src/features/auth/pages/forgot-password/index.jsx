import React, { useState } from "react";
import { BadgeCheck } from "lucide-react";
import supabase from "../../../../utils/supabase";
import ForgotReset from "./components/forgot-reset";
import ConfirmEmail from "./components/email-confirmation";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setSent(false);
    setError(null);

    try {
      // Check if profile exists with the given email and role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", values.email)
        .eq("role", values.role)
        .single();

      if (profileError || !profile) {
        setError("No account found with this email and role.");
        setLoading(false);
        setSubmitting(false);
        return;
      }

      // Send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        values.email
      );

      if (resetError) {
        setError("Failed to send reset email. Please try again.");
      } else {
        setSent(true);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-gradient-to-br from-blue-800 to-purple-500 flex flex-col justify-center items-center text-white p-8">
        <div className="mb-8 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/20 flex items-center rounded-full justify-center">
            <BadgeCheck className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
          <p className="text-sm text-white/80 max-w-xs">
            Enter your account email and select your role. If an account exists,
            a password reset link will be sent.
          </p>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          {!sent ? (
            <ForgotReset
              handleSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          ) : (
            <ConfirmEmail />
          )}
        </div>
      </div>
    </div>
  );
}
