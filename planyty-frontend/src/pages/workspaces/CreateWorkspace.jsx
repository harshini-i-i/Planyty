import React from 'react';
import { useNavigate } from 'react-router-dom';
import WorkspaceForm from '../../components/workspaces/WorkspaceForm';
import { ArrowLeft } from 'lucide-react';

const CreateWorkspace = () => {
  const navigate = useNavigate();

  const handleSubmit = (workspaceData) => {
    // Here you would typically make an API call to create the workspace
    console.log('Creating workspace:', workspaceData);
    
    // For now, just navigate back to workspaces
    navigate('/workspaces');
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/workspaces')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Workspaces
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Workspace</h1>
        <p className="text-gray-600 mb-8">
          Create a new workspace to organize your projects and collaborate with your team.
        </p>

        <WorkspaceForm
          isOpen={true}
          onClose={() => navigate('/workspaces')}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreateWorkspace;