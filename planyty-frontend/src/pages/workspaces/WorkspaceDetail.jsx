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

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Build a complete e-commerce solution with React and Node.js',
      taskCount: 15,
      progress: 60,
      memberCount: 4,
      dueDate: 'in 2 weeks'
    },
    {
      id: 2,
      name: 'Admin Dashboard',
      description: 'Create admin panel for managing orders and users',
      taskCount: 8,
      progress: 30,
      memberCount: 3,
      dueDate: 'in 1 week'
    },
    {
      id: 3,
      name: 'API Integration',
      description: 'Integrate third-party APIs and web services',
      taskCount: 12,
      progress: 80,
      memberCount: 2,
      dueDate: 'in 3 days'
    }
  ]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = (projectData) => {
    const newProject = {
      id: Math.max(...projects.map(p => p.id)) + 1,
      ...projectData,
      taskCount: 0,
      progress: 0,
      memberCount: 1,
      dueDate: projectData.dueDate ? new Date(projectData.dueDate).toLocaleDateString() : 'No due date'
    };
    setProjects([...projects, newProject]);
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              <p className="text-sm font-medium text-green-800">Team Members</p>
              <p className="text-2xl font-bold text-green-900">{workspace.memberCount}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Active Tasks</p>
              <p className="text-2xl font-bold text-purple-900">
                {projects.reduce((sum, project) => sum + project.taskCount, 0)}
              </p>
            </div>
            <Plus className="w-8 h-8 text-purple-600" />
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
          <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
      />
    </div>
  );
};

export default WorkspaceDetail;