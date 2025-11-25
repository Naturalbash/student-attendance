import DashboardPage from "../../Admin/components/dashboard-page";
import CoursesPage from "../../Admin/components/courses-page";
import AttendancePage from "../../Admin/components/attendance-page";
import ReportsPage from "../../Admin/components/reports-page";
import SettingsPage from "../../Admin/components/settings-page";
import { Navigate } from "react-router-dom";

export const AppRoutes = [
  { index: true, element: <Navigate to="dashboard" replace /> },
  {
    path: "dashboard",
    element: <DashboardPage />,
  },
  {
    path: "attendance",
    element: <AttendancePage />,
  },
  {
    path: "courses",
    element: <CoursesPage />,
  },
  {
    path: "reports",
    element: <ReportsPage />,
  },
  {
    path: "settings",
    element: <SettingsPage />,
  },
];
