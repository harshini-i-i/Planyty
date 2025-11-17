import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import KanbanBoard from '../components/tasks/KanbanBoard';
import Button from '../components/ui/Button';
import { Folder, ChevronDown, CheckCircle, TrendingUp } from 'lucide-react';

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
  const [showCompletedDropdown, setShowCompletedDropdown] = useState(false);
  
  // State to track completed tasks - this will be passed to KanbanBoard
  const [completedTasks, setCompletedTasks] = useState([]);

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setShowProjectDropdown(false);
  };

  const selectedProject = mockProjects.find(p => p.id === selectedProjectId);

  // Calculate progress percentage
  const totalTasks = 10; // This should come from your actual data
  const completedCount = completedTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3]">
      {/* Page Header - Fixed */}
      <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-200 bg-white animate-fade-in">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Folder className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">
                    {selectedProject ? selectedProject.name : 'Select Project'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-purple-500 transition-transform duration-300" />
                </button>

                {showProjectDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-purple-200 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-10 animate-slide-down">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm font-medium text-purple-600 border-b border-purple-200">
                        Select Project
                      </div>
                      {mockProjects.map(project => (
                        <button
                          key={project.id}
                          onClick={() => handleProjectSelect(project.id)}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-purple-50 transition-all duration-300 hover:scale-105 ${
                            selectedProjectId === project.id ? 'bg-purple-500 text-white' : 'text-gray-700'
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
                <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                  {selectedProject ? `${selectedProject.name} Tasks` : 'All Tasks'}
                </h1>
                <p className="text-gray-600 mt-2 animate-pulse-slow">
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
              <Button className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg animate-pulse-slow">
                <Folder className="w-5 h-5 mr-2" />
                Go to Workspaces
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-4 bg-white p-4 rounded-xl border border-purple-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="font-semibold text-gray-700">Project Progress</span>
              </div>
              
              {/* Progress Bar */}
              <div className="flex-1 max-w-md">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <span className="text-sm font-medium text-gray-600">
                {completedCount}/{totalTasks} tasks completed ({progressPercentage}%)
              </span>
            </div>

            {/* Completed Tasks Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCompletedDropdown(!showCompletedDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Completed Tasks</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showCompletedDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCompletedDropdown && completedTasks.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-green-200 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-20 animate-slide-down">
                  <div className="p-3">
                    <div className="px-3 py-2 text-sm font-medium text-green-600 border-b border-green-200 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Completed Tasks ({completedTasks.length})
                    </div>
                    <div className="max-h-60 overflow-y-auto mt-2">
                      {completedTasks.map((task, index) => (
                        <div
                          key={task.id}
                          className="px-3 py-2 border-b border-gray-100 last:border-b-0 hover:bg-green-50 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700">{task.title}</span>
                          </div>
                          {task.completedAt && (
                            <div className="text-xs text-gray-500 ml-6">
                              Completed on: {task.completedAt}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {showCompletedDropdown && completedTasks.length === 0 && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-green-200 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-20 animate-slide-down">
                  <div className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No tasks completed yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
          <div className="h-full inline-block">
            <KanbanBoard 
              projectId={selectedProjectId} 
              onCompletedTasksUpdate={setCompletedTasks}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;