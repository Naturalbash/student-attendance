import { Link } from "react-router-dom";

export default function ConfirmEmail() {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Check your email
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        If an account with the provided email and role exists, a password reset
        link has been sent.
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
  );
}
