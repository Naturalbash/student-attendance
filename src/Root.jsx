import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import Signin from "./Signin";
import Sidebar from "./Sidebar";
import Header from "./HeaderPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";
import CoursesPage from "./CoursesPage";
import AttendancePage from "./AttendancePage";
import StudentsPage from "./StudentsPage";
import StudentDashboard from "./StudentDashboard";
const RootApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/DashboardPage" element={<DashboardPage />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/ReportsPage" element={<ReportsPage />} />
        <Route path="/SettingsPage" element={<SettingsPage />} />
        <Route path="/CoursesPage" element={<CoursesPage />} />
        <Route path="/AttendancePage" element={<AttendancePage />} />
        <Route path="/StudentsPage" element={<StudentsPage />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RootApp;
