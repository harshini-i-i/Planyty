import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

const KanbanBoard = ({ projectId }) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const [columns, setColumns] = useState([
    {
      id: 1,
      title: 'To Do',
      tasks: [
        {
          id: 1,
          title: 'Design login page',
          priority: 'High',
          tags: ['UI', 'Design'],
          description: 'Create UI design for login page',
          assignee: 'Me',
          dueDate: 'N/A'
        },
        {
          id: 2,
          title: 'Setup project structure',
          priority: 'Medium',
          tags: ['Dev', 'Setup'],
          description: 'Initialize project with proper folder structure',
          assignee: 'Me',
          dueDate: 'N/A'
        }
      ]
    },
    {
      id: 2,
      title: 'In Progress',
      tasks: [
        {
          id: 3,
          title: 'Implement user authentication',
          priority: 'High',
          tags: ['Dev', 'Auth'],
          description: 'Set up user login and registration system',
          assignee: 'Me',
          dueDate: 'N/A'
        }
      ]
    },
    {
      id: 3,
      title: 'Review',
      tasks: [
        {
          id: 4,
          title: 'Refactor API service layer',
          priority: 'Medium',
          tags: ['Dev', 'Refactor'],
          description: 'Improve API service structure and error handling',
          assignee: 'Me',
          dueDate: 'N/A'
        }
      ]
    },
    {
      id: 4,
      title: 'Done',
      tasks: [
        {
          id: 5,
          title: 'Initial Tailwind setup',
          priority: 'Low',
          tags: ['Setup'],
          description: 'Set up Tailwind CSS configuration',
          assignee: 'Me',
          dueDate: 'N/A'
        }
      ]
    }
  ]);

  const handleAddTaskClick = (columnId) => {
    setSelectedColumn(columnId);
    setShowTaskForm(true);
  };

  const handleTaskSubmit = (taskData) => {
    const updatedColumns = columns.map(column => {
      if (column.id === selectedColumn) {
        const newTask = {
          id: Date.now(),
          ...taskData,
          projectId: projectId
        };
        return {
          ...column,
          tasks: [...column.tasks, newTask]
        };
      }
      return column;
    });

    setColumns(updatedColumns);
    setShowTaskForm(false);
    setSelectedColumn(null);
  };

  const handleTaskFormClose = () => {
    setShowTaskForm(false);
    setSelectedColumn(null);
  };

  const handleDeleteTask = (columnId, taskId) => {
    const updatedColumns = columns.map(column => {
      if (column.id === columnId) {
        const filteredTasks = column.tasks.filter(task => task.id !== taskId);
        return {
          ...column,
          tasks: filteredTasks
        };
      }
      return column;
    });

    setColumns(updatedColumns);
  };

  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      title: 'New Section',
      tasks: []
    };
    setColumns([...columns, newSection]);
  };

  const handleDeleteSection = (sectionId) => {
    const filteredColumns = columns.filter(column => column.id !== sectionId);
    setColumns(filteredColumns);
  };

  return (
    <>
      <div className="h-full p-6">
        <div className="flex gap-6 h-full" style={{ minWidth: 'min-content' }}>
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className="bg-white rounded-lg h-full flex flex-col shadow-sm border border-gray-200">
                {/* Column Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-700">{column.title}</h3>
                    <span className="bg-gray-200 text-gray-600 text-sm px-2 py-1 rounded-full">
                      {column.tasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSection(column.id)}
                    className="p-1 hover:bg-red-100 rounded transition-colors text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Tasks List */}
                <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                  {column.tasks.map((task) => (
                    <div key={task.id} className="relative group">
                      <TaskCard task={task} />
                      <button
                        onClick={() => handleDeleteTask(column.id, task.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Task Button */}
                  <button 
                    onClick={() => handleAddTaskClick(column.id)}
                    className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-500"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Section Button */}
          <div className="flex-shrink-0 w-80">
            <button
              onClick={handleAddSection}
              className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-gray-600">Add Section</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onClose={handleTaskFormClose}
          onSubmit={handleTaskSubmit}
        />
      )}
    </>
  );
};

export default KanbanBoard;