import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectForm from '../../components/projects/ProjectForm';
import Button from '../../components/ui/Button';
import { Plus, ArrowLeft, Search, Users, Calendar } from 'lucide-react';

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

  const handleEditProject = (projectData) => {
    // This would be implemented when editing an existing project
    console.log('Edit project:', projectData);
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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link to="/workspaces" className="mr-4">
          <Button variant="ghost">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{workspace.name}</h1>
          <p className="text-gray-600 mt-2">{workspace.description}</p>
        </div>
      </div>

      {/* Workspace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Projects</p>
              <p className="text-2xl font-bold text-blue-900">{projects.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Active Tasks</p>
              <p className="text-2xl font-bold text-green-900">{totalTasks}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Team Members</p>
              <p className="text-2xl font-bold text-purple-900">{totalTeamMembers}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800">Avg Progress</p>
              <p className="text-2xl font-bold text-orange-900">{averageProgress}%</p>
            </div>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{averageProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage projects in this workspace</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              workspaceId={workspaceId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
          </p>
          {!searchTerm && (
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create Project
            </Button>
          )}
        </div>
      )}

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