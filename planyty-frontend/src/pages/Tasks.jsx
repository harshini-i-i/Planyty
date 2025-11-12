import React from 'react';
import { Link } from 'react-router-dom';
import KanbanBoard from '../components/tasks/KanbanBoard';
import Button from '../components/ui/Button';
import { Folder } from 'lucide-react';

const Tasks = () => {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Header - Fixed */}
      <div className="flex-shrink-0 p-6 pb-4 border-b bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
            <p className="text-gray-600 mt-2">Viewing tasks across all projects</p>
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

      {/* Kanban Board Area - Horizontal Scroll Only */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
          <div className="h-full inline-block">
            <KanbanBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;