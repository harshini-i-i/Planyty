import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectForm from '../../components/projects/ProjectForm';
import { ArrowLeft } from 'lucide-react';

const CreateProject = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (projectData) => {
    // Here you would typically make an API call to create the project
    console.log('Creating project:', projectData);
    
    // Navigate back to the workspace
    navigate(`/workspaces/${workspaceId}`);
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(`/workspaces/${workspaceId}`)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Workspace
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
        <p className="text-gray-600 mb-8">
          Create a new project to organize tasks and collaborate with your team.
        </p>

        <ProjectForm
          isOpen={true}
          onClose={() => navigate(`/workspaces/${workspaceId}`)}
          onSubmit={handleSubmit}
          workspaceId={workspaceId}
        />
      </div>
    </div>
  );
};

export default CreateProject;