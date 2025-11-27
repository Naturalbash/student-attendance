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
import AttendancePage from "./src/features/Admin/components/attendance-page";
import CoursesPage from "./src/features/Admin/components/courses-page";
import ReportsPage from "./src/features/Admin/components/reports-page";
import SettingsPage from "./src/features/Admin/components/settings-page";

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
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/attendance" element={<AttendancePage />} />
          <Route path="/admin/courses" element={<CoursesPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
