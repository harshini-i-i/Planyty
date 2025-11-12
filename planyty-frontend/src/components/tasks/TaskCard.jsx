import React from 'react';
import { Tag, Clock, User } from 'lucide-react';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-red-500';
    case 'Medium':
      return 'bg-yellow-500';
    case 'Low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const TaskCard = ({ task }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-150">
      <h3 className="text-base font-semibold text-gray-800 mb-2">{task.title}</h3>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {task.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
          >
            <Tag size={12} className="inline mr-1" />
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
          <span>{task.priority}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>Due: {task.dueDate || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            <span>{task.assignee || 'Me'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;