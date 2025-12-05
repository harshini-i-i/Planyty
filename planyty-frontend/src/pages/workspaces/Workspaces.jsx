import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import WorkspaceCard from '../../components/workspaces/WorkspaceCard';
import WorkspaceForm from '../../components/workspaces/WorkspaceForm';
import Button from '../../components/ui/Button';
import { Plus, Search, Folder, Crown, Users, Grid3x3 } from 'lucide-react';

const Workspaces = () => {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - Team Lead sees all workspaces
  const allWorkspaces = [
    {
      id: 1,
      name: 'Web Development',
      description: 'All website development projects and tasks',
      projectCount: 3,
      memberCount: 8,
      color: 'blue',
      lastUpdated: '2 days ago',
      createdBy: 'team_lead'
    },
    {
      id: 2,
      name: 'Mobile App',
      description: 'iOS and Android application development',
      projectCount: 2,
      memberCount: 5,
      color: 'green',
      lastUpdated: '1 day ago',
      createdBy: 'team_lead'
    },
    {
      id: 3,
      name: 'Marketing',
      description: 'Marketing campaigns and content creation',
      projectCount: 4,
      memberCount: 6,
      color: 'purple',
      lastUpdated: '5 hours ago',
      createdBy: 'team_lead'
    },
    {
      id: 4,
      name: 'Design Team',
      description: 'UI/UX design projects and assets',
      projectCount: 2,
      memberCount: 4,
      color: 'pink',
      lastUpdated: '3 hours ago',
      createdBy: 'team_lead'
    }
  ];

  // Team Member sees only workspaces they are part of
  const teamMemberWorkspaces = [
    {
      id: 1,
      name: 'Web Development',
      description: 'All website development projects and tasks',
      projectCount: 3,
      memberCount: 8,
      color: 'blue',
      lastUpdated: '2 days ago',
      createdBy: 'team_lead'
    },
    {
      id: 3,
      name: 'Marketing',
      description: 'Marketing campaigns and content creation',
      projectCount: 4,
      memberCount: 6,
      color: 'purple',
      lastUpdated: '5 hours ago',
      createdBy: 'team_lead'
    }
  ];

  // Use different workspaces based on role
  const [workspaces, setWorkspaces] = useState(
    user?.role === 'team_lead' ? allWorkspaces : teamMemberWorkspaces
  );

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
      lastUpdated: 'Just now',
      createdBy: user?.role
    };
    setWorkspaces([...workspaces, newWorkspace]);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3] rounded-2xl shadow-2xl shadow-purple-200/50 overflow-hidden">
      {/* HEADER SECTION - Same as Meetings page */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Grid3x3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {user?.role === 'team_lead' ? 'All Workspaces' : 'My Workspaces'}
              </h1>
              <p className="text-sm text-gray-600">
                {user?.role === 'team_lead' 
                  ? 'Manage and organize all team workspaces' 
                  : 'Workspaces you are part of'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              user?.role === 'team_lead' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
            }`}>
              {user?.role === 'team_lead' ? <Crown className="w-4 h-4" /> : <Users className="w-4 h-4" />}
              <span className="text-sm font-semibold">
                {user?.role === 'team_lead' ? 'Team Lead' : 'Team Member'}
              </span>
            </div>
            
            {user?.role === 'team_lead' && (
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create Workspace
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="w-5 h-5 text-purple-400 absolute left-3 top-1/2 transform -translate-y-1/2 animate-pulse" />
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50 transition-all duration-300 hover:scale-105 focus:scale-105"
              />
            </div>
          </div>

          {/* Workspaces Grid */}
          {filteredWorkspaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredWorkspaces.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl border border-purple-200 shadow-sm">
              <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No workspaces found' : 'No workspaces available'}
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : user?.role === 'team_lead' 
                    ? 'Get started by creating your first workspace' 
                    : 'You are not part of any workspaces yet'
                }
              </p>
              {!searchTerm && user?.role === 'team_lead' && (
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create Workspace
                </Button>
              )}
            </div>
          )}

          {user?.role === 'team_lead' && (
            <WorkspaceForm
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateWorkspace}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspaces;