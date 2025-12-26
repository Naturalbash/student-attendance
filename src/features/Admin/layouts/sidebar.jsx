import { useState } from "react";
import {
  FaHome,
  FaCalendar,
  FaBook,
  FaUserEdit,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import LogoutModal from "../../../components/common/logout-modal";

const navLinks = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <FaHome className="h-4 w-4" />,
  },
  {
    label: "Attendance",
    href: "/admin/attendance",
    icon: <FaCalendar className="h-4 w-4" />,
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: <FaBook className="h-4 w-4" />,
  },
];

export default function Sidebar({ collapsed, closeSidebar }) {
  const location = useLocation();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = async () => {
    setLogoutOpen(false);
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    window.location.href = "/auth/sign-in";
  };

  return (
    <div
      className={`bg-white border-r flex flex-col h-full transition-width duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {!collapsed && (
            <span className="text-2xl font-medium">Admin Dashboard</span>
          )}
        </Link>
        {closeSidebar && (
          <button
            onClick={closeSidebar}
            className="md:hidden p-2 rounded hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            ×
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
        {/* Top Links */}
        <ul className="space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:text-black hover:bg-gray-100"
                }`}
              >
                {link.icon} {!collapsed && link.label}
              </Link>
            );
          })}
        </ul>

        {/* Bottom Links: Settings + Logout */}
        <div className="flex flex-col items-center space-y-2 mt-4">
          {/* Settings */}
          <Link
            to="/admin/settings"
            className={`flex items-center gap-2 w-full rounded-lg p-2 text-gray-700 hover:bg-gray-100 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <FaUserEdit className="h-4 w-4" /> {!collapsed && "Settings"}
          </Link>

          {/* Logout */}
          <button
            onClick={() => setLogoutOpen(true)}
            className={`flex items-center gap-2 w-full rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <FaSignOutAlt className="h-4 w-4" /> {!collapsed && "Logout"}
          </button>
        </div>
      </nav>

      {/* Logout Modal */}
      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
