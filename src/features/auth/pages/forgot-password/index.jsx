import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string().oneOf(["admin", "student"]).required("Select a role"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setLoading(true);
    setSent(false);

    // Replace with real API call when available.
    setTimeout(() => {
      setLoading(false);
      setSubmitting(false);
      setSent(true);
    }, 1000);
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
            <Formik
              initialValues={{ email: "", role: "student" }}
              validationSchema={schema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Reset your password
                  </h3>

                  <div className="mb-3">
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email"
                      className={`w-full px-4 py-2 border rounded-md mb-1 outline-none ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Account role
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <Field
                          type="radio"
                          name="role"
                          value="student"
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">Student</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Field
                          type="radio"
                          name="role"
                          value="admin"
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">Admin</span>
                      </label>
                    </div>
                    {errors.role && (
                      <p className="text-red-500 text-sm mt-2">{errors.role}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors font-medium disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Send reset link"}
                  </button>

                  <div className="mt-4 text-center">
                    <Link
                      to="/auth/sign-in"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Back to Sign in
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Check your email
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                If an account with the provided email and role exists, a
                password reset link has been sent.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  to="/auth/sign-in"
                  className="inline-block w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors text-center"
                >
                  Return to Sign in
                </Link>
                <Link
                  to="/auth/sign-up"
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Create a new account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
