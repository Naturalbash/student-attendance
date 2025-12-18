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
import AdminDashboard from "./src/features/Admin/pages/dashboard-page";
import AttendancePage from "./src/features/Admin/pages/attendance-page";
import CoursesPage from "./src/features/Admin/pages/courses-page";
import SettingsPage from "./src/features/Admin/pages/settings-page";
import StudentAppLayout from "./src/features/Student/layouts/layout";

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
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>

        {/* Student routes */}
        <Route path="/student" element={<StudentAppLayout />}>
          <Route path="/student/dashboard" element={<AdminDashboard />} />
          <Route path="/student/attendance" element={<AttendancePage />} />
          <Route path="/student/courses" element={<CoursesPage />} />
          <Route path="/student/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
