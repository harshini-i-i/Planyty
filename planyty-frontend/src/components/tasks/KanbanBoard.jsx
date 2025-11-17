import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, CheckCircle } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

const KanbanBoard = ({ projectId, onCompletedTasksUpdate }) => {
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
          dueDate: 'N/A',
          completedAt: '2024-01-15'
        }
      ]
    }
  ]);

  // Update completed tasks when columns change
  useEffect(() => {
    if (onCompletedTasksUpdate) {
      const doneColumn = columns.find(col => col.title === 'Done');
      if (doneColumn) {
        onCompletedTasksUpdate(doneColumn.tasks);
      }
    }
  }, [columns, onCompletedTasksUpdate]);

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

  const handleTaskComplete = (columnId, taskId) => {
    // If task is already in Done column, do nothing
    const sourceColumn = columns.find(col => col.id === columnId);
    if (sourceColumn.title === 'Done') {
      return;
    }

    // Find the task to complete
    const taskToComplete = sourceColumn.tasks.find(task => task.id === taskId);
    if (!taskToComplete) return;

    // Create completed task with timestamp
    const completedTask = {
      ...taskToComplete,
      completedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };

    // Update columns - remove from source, add to Done
    const updatedColumns = columns.map(column => {
      if (column.title === 'Done') {
        // Add to Done column
        return {
          ...column,
          tasks: [...column.tasks, completedTask]
        };
      } else if (column.id === columnId) {
        // Remove from source column
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

  const handleDragStart = (e, taskId, sourceColumnId) => {
    e.dataTransfer.setData('taskId', taskId.toString());
    e.dataTransfer.setData('sourceColumnId', sourceColumnId.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const sourceColumnId = parseInt(e.dataTransfer.getData('sourceColumnId'));

    if (sourceColumnId === targetColumnId) return;

    const updatedColumns = columns.map(column => {
      if (column.id === sourceColumnId) {
        // Remove task from source column
        const filteredTasks = column.tasks.filter(task => task.id !== taskId);
        return { ...column, tasks: filteredTasks };
      } else if (column.id === targetColumnId) {
        // Add task to target column
        const sourceColumn = columns.find(col => col.id === sourceColumnId);
        const movedTask = sourceColumn.tasks.find(task => task.id === taskId);
        
        // If moving to Done column, add completion timestamp
        const targetColumn = columns.find(col => col.id === targetColumnId);
        const taskWithCompletion = targetColumn.title === 'Done' ? {
          ...movedTask,
          completedAt: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        } : movedTask;

        return { ...column, tasks: [...column.tasks, taskWithCompletion] };
      }
      return column;
    });

    setColumns(updatedColumns);
  };

  return (
    <>
      <div className="h-full p-6">
        <div className="flex gap-6 h-full" style={{ minWidth: 'min-content' }}>
          {columns.map((column, index) => (
            <div 
              key={column.id} 
              className="flex-shrink-0 w-80 animate-slide-up" 
              style={{ animationDelay: `${index * 100}ms` }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="bg-white rounded-xl h-full flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300">
                {/* Column Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-purple-700 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                      {column.title}
                    </h3>
                    <span className={`text-sm px-2 py-1 rounded-full animate-pulse-slow ${
                      column.title === 'Done' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      {column.tasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSection(column.id)}
                    className="p-1 hover:bg-red-100 rounded-lg transition-all duration-300 hover:scale-110 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Tasks List */}
                <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                  {column.tasks.map((task, taskIndex) => (
                    <div 
                      key={task.id} 
                      className="relative group animate-fade-in" 
                      style={{ animationDelay: `${taskIndex * 50}ms` }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkmark Button */}
                        <button
                          onClick={() => handleTaskComplete(column.id, task.id)}
                          className={`mt-4 p-1 rounded-full transition-all duration-300 hover:scale-110 flex-shrink-0 ${
                            column.title === 'Done' 
                              ? 'bg-green-500 text-white cursor-default' 
                              : 'bg-gray-200 hover:bg-green-200 text-gray-500 hover:text-green-600'
                          }`}
                          title={column.title === 'Done' ? 'Completed' : 'Mark as complete'}
                          disabled={column.title === 'Done'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        
                        {/* Task Card */}
                        <div className="flex-1 min-w-0">
                          <TaskCard task={task} isCompleted={column.title === 'Done'} />
                        </div>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteTask(column.id, task.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Task Button */}
                  <button 
                    onClick={() => handleAddTaskClick(column.id)}
                    className="w-full p-3 border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 hover:scale-105 flex items-center justify-center text-purple-500 animate-pulse-slow"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Section Button */}
          <div className="flex-shrink-0 w-80 animate-slide-up" style={{ animationDelay: `${columns.length * 100}ms` }}>
            <button
              onClick={handleAddSection}
              className="w-full h-full border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 hover:scale-105 flex items-center justify-center animate-pulse-slow"
            >
              <Plus className="w-5 h-5 mr-2 text-purple-500" />
              <span className="text-purple-600 font-semibold">Add Section</span>
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