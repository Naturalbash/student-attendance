import React from "react";
import {
  Home,
  Users,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useState } from "react";

const Sidebar = ({ sidebarOpen, setSidebarOpen,activeTab, setActiveTab }) => {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "students", label: "Students", icon: Users },
    { id: "courses", label: "Courses", icon: TrendingUp },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "reports", label: "Reports", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

//    closeSidebar = () => { setSidebarOpen(false); };
//   const toggleSidebar = () => { setSidebarOpen(!sidebarOpen); };
//   const handleNavItemClick = (itemId) => { setActiveTab(itemId); setSidebarOpen(false); }
// const
  return (
    <div
      className={`fixed inset-y-0  w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0': '-translate-x-full'}transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static`}
    >
      <div className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white">
        <h1 className="text-xl font-bold">AttendanceHub</h1>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="flex flex-col ">
        <nav className="mt-8 flex-1 pb-20 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
