import React from 'react';
import { Link } from 'react-router-dom';
import { Folder, Users, Calendar } from 'lucide-react';

const WorkspaceCard = ({ workspace }) => {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <Link to={`/workspaces/${workspace.id}`}>
      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-full ${colorMap[workspace.color] || 'bg-blue-500'} bg-opacity-20`}>
            <Folder className={`w-6 h-6 text-${workspace.color}-500`} />
          </div>
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            {workspace.projectCount} Projects
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{workspace.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{workspace.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{workspace.memberCount} members</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{workspace.lastUpdated}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkspaceCard;