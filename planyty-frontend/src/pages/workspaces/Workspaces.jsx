import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WorkspaceCard from '../../components/workspaces/WorkspaceCard';
import WorkspaceForm from '../../components/workspaces/WorkspaceForm';
import Button from '../../components/ui/Button';
import { Plus, Search } from 'lucide-react';

const Workspaces = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API call
  const [workspaces, setWorkspaces] = useState([
    {
      id: 1,
      name: 'Web Development',
      description: 'All website development projects and tasks',
      projectCount: 3,
      memberCount: 8,
      color: 'blue',
      lastUpdated: '2 days ago'
    },
    {
      id: 2,
      name: 'Mobile App',
      description: 'iOS and Android application development',
      projectCount: 2,
      memberCount: 5,
      color: 'green',
      lastUpdated: '1 day ago'
    },
    {
      id: 3,
      name: 'Marketing',
      description: 'Marketing campaigns and content creation',
      projectCount: 4,
      memberCount: 6,
      color: 'purple',
      lastUpdated: '5 hours ago'
    }
  ]);

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorkspace = (workspaceData) => {
    const newWorkspace = {
      id: Math.max(...workspaces.map(w => w.id)) + 1,
      ...workspaceData,
      projectCount: 0,
      memberCount: 1,
      lastUpdated: 'Just now'
    };
    setWorkspaces([...workspaces, newWorkspace]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
          <p className="text-gray-600 mt-2">Organize your projects into workspaces</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New Workspace
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workspaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Workspaces Grid */}
      {filteredWorkspaces.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workspaces found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first workspace'}
          </p>
          {!searchTerm && (
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create Workspace
            </Button>
          )}
        </div>
      )}

      <WorkspaceForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateWorkspace}
      />
    </div>
  );
};

export default Workspaces;