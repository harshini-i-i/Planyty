import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  List,
  MessageSquare,
  Calendar,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  User,
  LogOut
} from "lucide-react";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#fef7e5] shadow-md transition-all duration-300 z-50 ${
          isOpen ? "w-60" : "w-16"
        }`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {isOpen && <h1 className="text-lg font-bold text-gray-800">Planyty</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-200 transition"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="mt-4 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-yellow-100 ${
                isActive ? "bg-yellow-200 font-medium" : ""
              }`
            }
          >
            <LayoutDashboard size={18} /> {isOpen && "Dashboard"}
          </NavLink>

          <NavLink
            to="/workspaces"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-yellow-100 ${
                isActive ? "bg-yellow-200 font-medium" : ""
              }`
            }
          >
            <Folder size={18} /> {isOpen && "Workspaces"}
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-yellow-100 ${
                isActive ? "bg-yellow-200 font-medium" : ""
              }`
            }
          >
            <List size={18} /> {isOpen && "Tasks"}
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-yellow-100 ${
                isActive ? "bg-yellow-200 font-medium" : ""
              }`
            }
          >
            <MessageSquare size={18} /> {isOpen && "Chat"}
          </NavLink>

          <NavLink
            to="/meetings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-yellow-100 ${
                isActive ? "bg-yellow-200 font-medium" : ""
              }`
            }
          >
            <Calendar size={18} /> {isOpen && "Meetings"}
          </NavLink>

          <NavLink
            to="/team"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-yellow-100 ${
                isActive ? "bg-yellow-200 font-medium" : ""
              }`
            }
          >
            <Users size={18} /> {isOpen && "Team"}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-yellow-100 ${
                isActive ? "bg-yellow-200 font-medium" : ""
              }`
            }
          >
            <Settings size={18} /> {isOpen && "Settings"}
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 w-full text-center text-xs text-gray-500">
          © 2025 Planyty
        </div>
      </aside>

      {/* ===== Main Section ===== */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${
          isOpen ? "ml-60" : "ml-16"
        }`}
      >
        {/* Fixed Header */}
        <header className="fixed top-0 right-0 left-0 bg-white shadow-sm h-16 flex items-center justify-between px-6 z-40 border-b border-gray-200">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm"
              />
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Harshini</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* ===== Page Content ===== */}
        <main className="flex-1 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;