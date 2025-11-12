import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { SocketProvider } from './contexts/SocketContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Chat from './pages/Chat';
import Meetings from './pages/Meetings';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import Team from './pages/Team'; // Make sure this file exists
import Settings from './pages/Settings'; // Make sure this file exists

// Workspace Pages
import Workspaces from './pages/workspaces/Workspaces';
import WorkspaceDetail from './pages/workspaces/WorkspaceDetail';
import CreateWorkspace from './pages/workspaces/CreateWorkspace';

// Project Pages  
import Projects from './pages/projects/Projects';
import ProjectDetail from './pages/projects/ProjectDetail';
import CreateProject from './pages/projects/CreateProject';

// ✅ Main Layout for authenticated users
const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-primary">
      {/* Sidebar - Starts OPEN */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
      />

      {/* Floating Logo Button - Only show when sidebar is CLOSED */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          title="Open Menu"
        >
          <span className="text-white font-bold text-sm">P</span>
        </button>
      )}

      {/* Clickable area on desktop to close sidebar when clicking logo area */}
      {isSidebarOpen && (
        <div 
          className="fixed top-4 left-4 z-40 w-64 h-16 cursor-pointer"
          onClick={toggleSidebar}
          title="Close Menu"
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'
      }`}>
        <Header />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Workspace Routes */}
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/workspaces/create" element={<CreateWorkspace />} />
            <Route path="/workspaces/:workspaceId" element={<WorkspaceDetail />} />
            
            {/* Project Routes */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/workspaces/:workspaceId/projects/create" element={<CreateProject />} />
            <Route path="/workspaces/:workspaceId/projects/:projectId" element={<ProjectDetail />} />
            
            {/* Existing Routes */}
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Catch all routes in main layout and redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// ✅ App Router - Handles all routing including auth
const AppRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark mx-auto"></div>
          <p className="mt-4 text-dark">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
          <Route path="/*" element={<MainLayout />} />
        </>
      )}
    </Routes>
  );
};

// ✅ Root Component with all Providers
const App = () => (
  <AuthProvider>
    <AppProvider>
      <SocketProvider>
        <AppRouter />
      </SocketProvider>
    </AppProvider>
  </AuthProvider>
);

export default App;