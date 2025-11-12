import React from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Users, Calendar, CheckCircle2 } from 'lucide-react';

const ProjectCard = ({ project, workspaceId }) => {
  const progressPercentage = project.progress || 0;
  
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Link to={`/workspaces/${workspaceId}/projects/${project.id}`}>
      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-4">
          <FolderKanban className="w-8 h-8 text-blue-500" />
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {project.taskCount} Tasks
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getProgressColor(progressPercentage)} transition-all duration-300`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{project.memberCount || 1} members</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{project.dueDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;