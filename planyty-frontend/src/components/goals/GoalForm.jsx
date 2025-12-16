import React, { useState } from 'react';
import { X, Calendar, Users, Flag, Target, ChevronDown, Plus, Trash2, Eye, EyeOff, BarChart3 } from 'lucide-react';
import Button from '../ui/Button';

const GoalForm = ({ onClose, onSubmit, goal }) => {
  const [formData, setFormData] = useState({
    title: goal ? goal.title : '',
    description: goal ? goal.description : '',
    category: goal ? goal.category : 'Company Goals',
    priority: goal ? goal.priority : 'Medium',
    dueDate: goal ? goal.dueDate : '',
    isPublic: goal ? goal.isPublic : true,
    assignedTo: goal ? goal.assignedTo : [],
    keyResults: goal ? goal.keyResults : [{ title: '', completed: false }],
    targetProgress: goal ? goal.targetProgress : 100,
  });

  const [newAssignee, setNewAssignee] = useState('');
  const [teams] = useState([
    'Alex Johnson',
    'Sarah Miller', 
    'Mike Chen',
    'David Wilson',
    'Lisa Taylor',
    'Engineering Team',
    'Marketing Team',
    'Design Team'
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    // Filter out empty key results
    const filteredKeyResults = formData.keyResults.filter(kr => kr.title.trim() !== '');
    
    onSubmit({
      ...formData,
      keyResults: filteredKeyResults.length > 0 ? filteredKeyResults : [{ title: 'First key result', completed: false }]
    });
  };

  const addAssignee = () => {
    if (newAssignee.trim() && !formData.assignedTo.includes(newAssignee.trim())) {
      setFormData({
        ...formData,
        assignedTo: [...formData.assignedTo, newAssignee.trim()]
      });
      setNewAssignee('');
    }
  };

  const removeAssignee = (assigneeToRemove) => {
    setFormData({
      ...formData,
      assignedTo: formData.assignedTo.filter(assignee => assignee !== assigneeToRemove)
    });
  };

  const addKeyResult = () => {
    setFormData({
      ...formData,
      keyResults: [...formData.keyResults, { title: '', completed: false }]
    });
  };

  const updateKeyResult = (index, field, value) => {
    const updatedKeyResults = [...formData.keyResults];
    updatedKeyResults[index] = {
      ...updatedKeyResults[index],
      [field]: value
    };
    setFormData({ ...formData, keyResults: updatedKeyResults });
  };

  const removeKeyResult = (index) => {
    const updatedKeyResults = formData.keyResults.filter((_, i) => i !== index);
    setFormData({ ...formData, keyResults: updatedKeyResults });
  };

  const categories = [
    'Company Goals',
    'Team Goals', 
    'Personal Goals',
    'Quarterly Goals',
    'Annual Goals',
    'Department Goals'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-purple-200">
        <div className="flex justify-between items-center p-6 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
          <h2 className="text-xl font-semibold text-purple-800">
            {goal ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Goal Title */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Goal Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
              placeholder="What do you want to achieve?"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
              placeholder="Describe your goal in detail..."
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center gap-1">
                <Target className="w-4 h-4" />
                Category
              </label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50 appearance-none pr-10"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center gap-1">
                <Flag className="w-4 h-4" />
                Priority
              </label>
              <div className="relative">
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50 appearance-none pr-10"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Target Progress and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                Target Progress
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.targetProgress}
                  onChange={(e) => setFormData({ ...formData, targetProgress: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                />
                <span className="w-16 text-center font-semibold text-purple-700">
                  {formData.targetProgress}%
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
              />
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-3">
              Visibility
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPublic: true })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  formData.isPublic 
                    ? 'bg-green-50 border-green-500 text-green-700' 
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Eye className="w-4 h-4" />
                Public
                <span className="text-xs opacity-75">Visible to everyone</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPublic: false })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  !formData.isPublic 
                    ? 'bg-purple-50 border-purple-500 text-purple-700' 
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <EyeOff className="w-4 h-4" />
                Private
                <span className="text-xs opacity-75">Only visible to you</span>
              </button>
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Assigned To
            </label>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
                  placeholder="Search team members..."
                />
                {teams.filter(t => t.toLowerCase().includes(newAssignee.toLowerCase())).length > 0 && newAssignee && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-purple-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {teams
                      .filter(t => t.toLowerCase().includes(newAssignee.toLowerCase()))
                      .map(team => (
                        <button
                          key={team}
                          type="button"
                          onClick={() => {
                            if (!formData.assignedTo.includes(team)) {
                              setFormData({
                                ...formData,
                                assignedTo: [...formData.assignedTo, team]
                              });
                            }
                            setNewAssignee('');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-purple-50"
                        >
                          {team}
                        </button>
                      ))}
                  </div>
                )}
              </div>
              <Button 
                type="button" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={addAssignee}
              >
                Add
              </Button>
            </div>
            
            {/* Assigned People */}
            <div className="flex flex-wrap gap-2">
              {formData.assignedTo.map((assignee, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full"
                >
                  <span>{assignee}</span>
                  <button
                    type="button"
                    onClick={() => removeAssignee(assignee)}
                    className="ml-1 hover:text-purple-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Key Results */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-purple-700 flex items-center gap-1">
                <Target className="w-4 h-4" />
                Key Results (OKRs)
              </label>
              <Button
                type="button"
                className="text-sm bg-green-600 hover:bg-green-700 text-white"
                onClick={addKeyResult}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Key Result
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.keyResults.map((kr, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={kr.title}
                    onChange={(e) => updateKeyResult(index, 'title', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
                    placeholder={`Key result ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeKeyResult(index)}
                    className="p-2 hover:bg-red-100 rounded-lg"
                    disabled={formData.keyResults.length === 1}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {goal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;