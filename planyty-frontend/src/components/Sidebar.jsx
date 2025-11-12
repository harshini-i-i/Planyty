import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListChecks, MessageSquare, Calendar, Settings, Users, Folder, X } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Workspaces', path: '/workspaces', icon: Folder },
  { name: 'Tasks', path: '/tasks', icon: ListChecks },
  { name: 'Chat', path: '/chat', icon: MessageSquare },
  { name: 'Meetings', path: '/meetings', icon: Calendar },
  { name: 'Team', path: '/team', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay for mobile - closes sidebar when clicked */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-secondary transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out shadow-xl`}
      >
        {/* Header with Clickable Logo to CLOSE sidebar */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-extrabold text-dark ml-3">Planyty</h1>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                // Close sidebar on mobile after click
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mx-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                  isActive
                    ? 'bg-accent text-dark'
                    : 'text-gray-700 hover:bg-accent/50 hover:text-dark'
                }`
              }
            >
              <item.icon className="w-5 h-5 min-w-5" />
              <span className="ml-3 whitespace-nowrap">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Planyty
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;