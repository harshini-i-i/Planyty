import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectForm from '../../components/projects/ProjectForm';
import Button from '../../components/ui/Button';
import { Plus, ArrowLeft, Search, Users, Calendar, Folder, TrendingUp, Filter } from 'lucide-react';

const WorkspaceDetail = () => {
  const { workspaceId } = useParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API call using workspaceId
  const workspace = {
    id: 1,
    name: 'Web Development',
    description: 'All website development projects and tasks',
    color: 'blue',
    memberCount: 8,
    createdAt: '2024-01-15'
  };

  // Mock team members data
  const availableTeamMembers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'SW' },
    { id: 5, name: 'Alex Brown', email: 'alex@example.com', avatar: 'AB' }
  ];

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Build a complete e-commerce solution with React and Node.js',
      taskCount: 15,
      progress: 60,
      teamMembers: [
        { id: 1, name: 'John Doe', avatar: 'JD' },
        { id: 2, name: 'Jane Smith', avatar: 'JS' },
        { id: 3, name: 'Mike Johnson', avatar: 'MJ' }
      ],
      memberCount: 3,
      startDate: '2024-01-15',
      dueDate: '2024-03-15'
    },
    {
      id: 2,
      name: 'Admin Dashboard',
      description: 'Create admin panel for managing orders and users',
      taskCount: 8,
      progress: 30,
      teamMembers: [
        { id: 2, name: 'Jane Smith', avatar: 'JS' },
        { id: 4, name: 'Sarah Wilson', avatar: 'SW' }
      ],
      memberCount: 2,
      startDate: '2024-02-01',
      dueDate: '2024-02-28'
    },
    {
      id: 3,
      name: 'API Integration',
      description: 'Integrate third-party APIs and web services',
      taskCount: 12,
      progress: 80,
      teamMembers: [
        { id: 1, name: 'John Doe', avatar: 'JD' },
        { id: 5, name: 'Alex Brown', avatar: 'AB' }
      ],
      memberCount: 2,
      startDate: '2024-01-20',
      dueDate: '2024-02-20'
    },
    {
      id: 4,
      name: 'Mobile App Development',
      description: 'Build cross-platform mobile application using React Native',
      taskCount: 20,
      progress: 15,
      teamMembers: [
        { id: 2, name: 'Jane Smith', avatar: 'JS' },
        { id: 3, name: 'Mike Johnson', avatar: 'MJ' },
        { id: 4, name: 'Sarah Wilson', avatar: 'SW' },
        { id: 5, name: 'Alex Brown', avatar: 'AB' }
      ],
      memberCount: 4,
      startDate: '2024-03-01',
      dueDate: '2024-06-01'
    }
  ]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = (projectData) => {
    // Get selected team members data
    const selectedMembers = availableTeamMembers.filter(member => 
      projectData.teamMembers.includes(member.id)
    );

    const newProject = {
      id: Math.max(...projects.map(p => p.id)) + 1,
      ...projectData,
      taskCount: 0,
      progress: 0,
      teamMembers: selectedMembers,
      memberCount: selectedMembers.length,
      dueDate: projectData.dueDate || '',
      startDate: projectData.startDate || ''
    };
    setProjects([...projects, newProject]);
  };

  // Calculate workspace statistics
  const totalTasks = projects.reduce((sum, project) => sum + project.taskCount, 0);
  const averageProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)
    : 0;
  const totalTeamMembers = new Set(
    projects.flatMap(project => project.teamMembers.map(member => member.id))
  ).size;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3] rounded-2xl shadow-2xl shadow-purple-200/50 overflow-hidden">
      {/* Header - Matching other modules */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-3 flex-1">
            <Link to="/workspaces">
              <button className="flex items-center text-gray-600 hover:text-gray-900 hover:scale-105 transition-transform">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Back to Workspaces</span>
              </button>
            </Link>

            <div className="border-l border-gray-300 h-6"></div>

            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                {workspace.name}
              </h1>
              <p className="text-xs text-gray-600">
                {workspace.description}
              </p>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-1.5 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors duration-200 text-sm">
                <Filter className="w-4 h-4 text-purple-500" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>

          {/* Right Section - Create Project Button */}
          <div>
            <button 
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-1.5 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-purple-200 hover:shadow-purple-300 text-sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-800">Total Projects</p>
                <p className="text-lg font-bold text-blue-900">{projects.length}</p>
              </div>
              <Folder className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-800">Active Tasks</p>
                <p className="text-lg font-bold text-green-900">{totalTasks}</p>
              </div>
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-800">Team Members</p>
                <p className="text-lg font-bold text-purple-900">{totalTeamMembers}</p>
              </div>
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-800">Avg Progress</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-orange-900">{averageProgress}%</p>
                  <div className="w-16">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-amber-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${averageProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-4 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
            <p className="text-sm text-gray-600">Manage projects in this workspace</p>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  workspaceId={workspaceId}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-dashed border-purple-300 p-8 text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Folder className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {searchTerm ? 'No projects found' : 'No projects yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Get started by creating your first project'}
                </p>
                {!searchTerm && (
                  <button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-purple-200"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Create First Project
                  </button>
                )}
                {searchTerm && (
                  <button 
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ProjectForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        workspaceId={workspaceId}
        availableTeamMembers={availableTeamMembers}
      />
    </div>
  );
};

export default WorkspaceDetail;