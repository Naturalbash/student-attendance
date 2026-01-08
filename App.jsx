import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* Auth pages */
import SignIn from "./src/features/auth/pages/sign-in";
import SignUp from "./src/features/auth/pages/sign-up";
import ForgotPassword from "./src/features/auth/pages/forgot-password";
import ConfirmEmail from "./src/features/auth/pages/confirm";
import ResetPassword from "./src/features/auth/pages/reset-password";

/* Admin */
import AdminAppLayout from "./src/features/Admin/layouts/layout";
import AdminDashboard from "./src/features/Admin/pages/dashboard";
import AdminStudentsPage from "@/features/Admin/pages/student-page";
import AttendancePage from "./src/features/Admin/pages/attendance-page";
import CoursesPage from "./src/features/Admin/pages/courses-page";

import SettingsPage from "./src/components/common/settings-page";

/*Student*/
import StudentAppLayout from "./src/features/Student/layouts/layout";
import StudentDashboardPage from "./src/features/Student/pages/student-dashboard-page";
import StudentAttendancePage from "./src/features/Student/pages/attendance-page";
import MyCoursesPage from "./src/features/Student/pages/courses-page";
import MyProjectsPage from "./src/features/Student/pages/projects-page";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />

          {/* Auth routes */}
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/confirm" element={<ConfirmEmail />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminAppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Student routes */}
          <Route path="/student" element={<StudentAppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="courses" element={<MyCoursesPage />} />
            <Route path="projects" element={<MyProjectsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
