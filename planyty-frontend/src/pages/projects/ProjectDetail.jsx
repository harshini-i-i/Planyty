import React from 'react';
import { useParams, Link } from 'react-router-dom';
import KanbanBoard from '../../components/tasks/KanbanBoard';
import Button from '../../components/ui/Button';
import { Plus, ArrowLeft, Calendar, Users, Flag } from 'lucide-react';

const ProjectDetail = () => {
  const { workspaceId, projectId } = useParams();

  // Mock project data - replace with API call
  const project = {
    id: projectId,
    name: 'E-commerce Platform',
    description: 'Build a complete e-commerce solution with React and Node.js',
    dueDate: '2024-02-15',
    memberCount: 4,
    priority: 'High',
    workspaceName: 'Web Development'
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Header - Fixed - Matching Tasks page structure */}
      <div className="flex-shrink-0 p-6 pb-4 border-b bg-white">
        <div className="flex items-center mb-4">
          <Link to={`/workspaces/${workspaceId}`} className="mr-4">
            <Button variant="ghost">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <div className="flex justify-between items-center flex-1">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-2">{project.description}</p>
            </div>
            {/* Removed the New Task button from header as well */}
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Due Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(project.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Team Members</p>
                <p className="text-lg font-semibold text-gray-900">{project.memberCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Flag className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Priority</p>
                <p className="text-lg font-semibold text-gray-900">{project.priority}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Area - EXACTLY like Tasks page */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
          <div className="h-full inline-block">
            <KanbanBoard projectId={projectId} showAddTaskButton={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;