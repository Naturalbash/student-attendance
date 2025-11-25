import React from "react";
import { Bell, Menu, Search, User } from "lucide-react";
const HeaderPage = ({ setSidebarOpen, activeTab }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-around px-6 py-4">
        <div className="flex items-center">
          <button onClick={() => setSidebarOpen(true)} className="mr-4">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className=" hidden sm:block">
            <Search className="w-2 h-1   transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <Bell className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderPage;
