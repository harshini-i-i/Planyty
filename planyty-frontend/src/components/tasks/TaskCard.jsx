import React from 'react';
import { Tag, Clock, User, CheckCircle } from 'lucide-react';

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

const TaskCard = ({ task, isCompleted = false }) => {
  return (
    <div className={`p-4 bg-white rounded-xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ${
      isCompleted ? 'opacity-75 bg-green-50 border-green-200' : ''
    }`}>
      {/* Task Title with Completion Status */}
      <div className="flex items-start justify-between mb-2">
        <h3 className={`text-base font-semibold flex-1 ${
          isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'
        }`}>
          {task.title}
        </h3>
        {isCompleted && (
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 ml-2 mt-1" />
        )}
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {task.tags.map((tag, index) => (
          <span
            key={index}
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              isCompleted 
                ? 'text-gray-400 bg-gray-100' 
                : 'text-purple-600 bg-purple-100'
            }`}
          >
            <Tag size={12} className="inline mr-1" />
            {tag}
          </span>
        ))}
      </div>

      {/* Task Metadata */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${
            isCompleted ? 'bg-gray-400' : getPriorityColor(task.priority)
          }`}></span>
          <span className={isCompleted ? 'text-gray-400' : 'text-gray-500'}>
            {task.priority}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock size={14} className={`mr-1 ${
              isCompleted ? 'text-gray-400' : 'text-purple-500'
            }`} />
            <span className={isCompleted ? 'text-gray-400' : 'text-gray-500'}>
              Due: {task.dueDate || 'N/A'}
            </span>
          </div>
          <div className="flex items-center">
            <User size={14} className={`mr-1 ${
              isCompleted ? 'text-gray-400' : 'text-purple-500'
            }`} />
            <span className={isCompleted ? 'text-gray-400' : 'text-gray-500'}>
              {task.assignee || 'Me'}
            </span>
          </div>
        </div>
      </div>

      {/* Completion Date */}
      {isCompleted && task.completedAt && (
        <div className="mt-2 pt-2 border-t border-green-200">
          <div className="flex items-center text-xs text-green-600">
            <CheckCircle size={12} className="mr-1" />
            Completed on {task.completedAt}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;