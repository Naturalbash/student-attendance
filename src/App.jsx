import React, { useState } from "react";

import DashboardPage from "./DashboardPage";
import StudentsPage from "./StudentsPage";
import CoursesPage from "./CoursesPage";
import AttendancePage from "./AttendancePage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";
import Sidebar from "./Sidebar";
import Header from "./HeaderPage";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  // const navigate = useNavigate();
  // different pages

  const renderContent = () => {
    <div className=""></div>;
    switch (activeTab) {
      case "students":
        return <StudentsPage/>;
      case "courses":
        return <CoursesPage/>;
      case "attendance":
        return <AttendancePage />;
      case "reports":
        return <ReportsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* for phone */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/*main*/}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} activeTab={activeTab} />

        {/*main2*/}
        <main className="flex-1 overflow-y-auto p-6" activeTab={activeTab}>{renderContent()}</main>
      </div>
    </div>
  );
};

export default App;
