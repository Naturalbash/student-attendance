import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* Auth pages */
import SignIn from "./src/features/auth/pages/sign-in";
import SignUp from "./src/features/auth/pages/sign-up";
import ForgotPassword from "./src/features/auth/pages/forgot-password";

/* Admin */
import AdminAppLayout from "./src/features/Admin/layouts/layout";
import AdminDashboard from "./src/features/Admin/components/dashboard-page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />

        {/* Auth routes */}
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminAppLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="attendance" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
