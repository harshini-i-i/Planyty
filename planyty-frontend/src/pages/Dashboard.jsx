import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search, Filter, Share, Settings, BarChart3, Users, Folder, Target } from 'lucide-react';

const StatCard = ({ title, value, subtext, filter }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex items-start justify-between mb-2">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      {filter && (
        <button className="text-gray-400 hover:text-gray-600">
          <Filter className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  const projectStats = [
    { title: 'Total Projects', value: '8', subtext: 'Active projects', filter: false },
    { title: 'Completed Projects', value: '2', subtext: 'This month', filter: true },
    { title: 'In Progress', value: '5', subtext: 'Currently working', filter: true },
    { title: 'Overdue', value: '1', subtext: 'Need attention', filter: true },
  ];

  const projectsData = [
    { name: 'Website Redesign', progress: 75, tasks: 12, team: 4 },
    { name: 'Mobile App Launch', progress: 30, tasks: 8, team: 3 },
    { name: 'Marketing Campaign', progress: 90, tasks: 5, team: 2 },
    { name: 'Product Research', progress: 45, tasks: 6, team: 3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name || 'User'}!</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Navigation */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Create</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-gray-900 cursor-pointer">Home</li>
              <li className="hover:text-gray-900 cursor-pointer">My Projects</li>
              <li className="hover:text-gray-900 cursor-pointer">Inbox</li>
            </ul>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Insights</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-gray-900 cursor-pointer">Reporting</li>
              <li className="hover:text-gray-900 cursor-pointer">Portfolios</li>
              <li className="hover:text-gray-900 cursor-pointer">Goals</li>
            </ul>
          </div>

          {/* Projects List */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Projects</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-gray-900 cursor-pointer">Cross-functional project team</li>
              <li className="hover:text-gray-900 cursor-pointer">Website Development</li>
              <li className="hover:text-gray-900 cursor-pointer">Mobile App</li>
            </ul>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Team</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-gray-900 cursor-pointer">My workspace</li>
            </ul>
          </div>

          {/* Trial Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
            <h3 className="font-semibold mb-1">Advanced free trial</h3>
            <p className="text-sm opacity-90">10 days left</p>
            <button className="mt-3 text-sm bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
              Add billing info
            </button>
          </div>

          {/* Invite Teammates */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium">
              Invite teammates
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Project Views */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-4 text-sm font-medium">
              <span className="text-gray-500">My Projects</span>
              <span className="text-gray-500 cursor-pointer hover:text-gray-700">List</span>
              <span className="text-gray-500 cursor-pointer hover:text-gray-700">Board</span>
              <span className="text-gray-500 cursor-pointer hover:text-gray-700">Calendar</span>
              <span className="text-blue-600 border-b-2 border-blue-600 cursor-pointer">Dashboard</span>
              <span className="text-gray-500 cursor-pointer hover:text-gray-700">Files</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projectStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Projects by Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Projects by Status</h3>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">1 Filter</span>
                <button className="text-sm text-blue-600 hover:text-blue-700">See all</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">4</div>
                <div className="text-sm text-gray-500 mt-1">Planning</div>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-sm text-gray-500 mt-1">In Progress</div>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-500 mt-1">Review</div>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-500 mt-1">Completed</div>
              </div>
            </div>
          </div>

          {/* Project Progress */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Project Completion Status</h3>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">2 Filters</span>
                <button className="text-sm text-blue-600 hover:text-blue-700">See all</button>
              </div>
            </div>
            
            {/* Progress Chart */}
            <div className="space-y-4">
              {projectsData.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{project.name}</span>
                      <span className="text-sm text-gray-500">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{project.tasks} tasks</span>
                      <span>{project.team} team members</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                + Add widget
              </button>
              <div className="flex items-center space-x-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;