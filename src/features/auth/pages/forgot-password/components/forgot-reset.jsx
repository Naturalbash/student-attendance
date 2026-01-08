import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

export default function ForgotReset({ handleSubmit, loading, error }) {
  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string().oneOf(["admin", "student"]).required("Select a role"),
  });
  return (
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

          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded text-sm mb-4">
              {error}
            </p>
          )}

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
  );
}
