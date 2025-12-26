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
import ConfirmEmail from "./src/features/auth/pages/confirm";

/* Admin */
import AdminAppLayout from "./src/features/Admin/layouts/layout";
import AdminDashboard from "./src/features/Admin/pages/dashboard-page";
import AttendancePage from "./src/features/Admin/pages/attendance-page";
import CoursesPage from "./src/features/Admin/pages/courses-page";

import SettingsPage from "./src/components/common/settings-page";

/*Student*/
import StudentAppLayout from "./src/features/Student/layouts/layout";
import StudentDashboardPage from "./src/features/Student/pages/student-dashboard-page";
import StudentAttendancePage from "./src/features/Student/pages/attendance-page";
import MyCoursesPage from "./src/features/Student/pages/courses-page";
import MyProjectsPage from "./src/features/Student/pages/projects-page";
import StudentReportsPage from "./src/features/Student/pages/reports-page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />

        {/* Auth routes */}
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/confirm" element={<ConfirmEmail />} />
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
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route
            path="/student/attendance"
            element={<StudentAttendancePage />}
          />
          <Route path="/student/courses" element={<MyCoursesPage />} />
          <Route path="/student/settings" element={<SettingsPage />} />
          <Route path="/student/projects" element={<MyProjectsPage />} />
          <Route path="/student/reports" element={<StudentReportsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
