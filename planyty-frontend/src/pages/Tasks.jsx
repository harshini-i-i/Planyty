import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import KanbanBoard from '../components/tasks/KanbanBoard';
import Button from '../components/ui/Button';
import { Folder, ChevronDown } from 'lucide-react';

// Mock projects list - in real app, this would come from API
const mockProjects = [
  { id: 1, name: 'Website Redesign' },
  { id: 2, name: 'Mobile App' },
  { id: 3, name: 'API Development' },
  { id: 4, name: 'Database Migration' }
];

const Tasks = () => {
  const { projectId: urlProjectId } = useParams();
  const [selectedProjectId, setSelectedProjectId] = useState(urlProjectId ? parseInt(urlProjectId) : null);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setShowProjectDropdown(false);
  };

  const selectedProject = mockProjects.find(p => p.id === selectedProjectId);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Header - Fixed */}
      <div className="flex-shrink-0 p-6 pb-4 border-b bg-white">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Folder className="w-5 h-5" />
                  <span className="text-gray-700">
                    {selectedProject ? selectedProject.name : 'Select Project'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showProjectDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b border-gray-200">
                        Select Project
                      </div>
                      {mockProjects.map(project => (
                        <button
                          key={project.id}
                          onClick={() => handleProjectSelect(project.id)}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                            selectedProjectId === project.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          {project.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedProject ? `${selectedProject.name} Tasks` : 'All Tasks'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {selectedProject 
                    ? `Viewing tasks for ${selectedProject.name}` 
                    : 'Select a project to view its tasks'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <Link to="/workspaces">
              <Button variant="secondary">
                <Folder className="w-5 h-5 mr-2" />
                Go to Workspaces
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
          <div className="h-full inline-block">
            <KanbanBoard projectId={selectedProjectId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;