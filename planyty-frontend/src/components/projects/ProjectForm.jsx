import React, { useState } from 'react';
import Button from '../ui/Button';
import { X, Calendar, UserPlus, Users } from 'lucide-react';

const ProjectForm = ({ isOpen, onClose, onSubmit, initialData, workspaceId }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || '',
    startDate: initialData?.startDate || '',
    teamMembers: initialData?.teamMembers || []
  });

  // Mock team members - replace with actual data from your API
  const availableTeamMembers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'SW' },
    { id: 5, name: 'Alex Brown', email: 'alex@example.com', avatar: 'AB' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, workspaceId });
    onClose();
  };

  const toggleTeamMember = (memberId) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter(id => id !== memberId)
        : [...prev.teamMembers, memberId]
    }));
  };

  const getSelectedMembers = () => {
    return availableTeamMembers.filter(member => 
      formData.teamMembers.includes(member.id)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project description"
            />
          </div>

          {/* Timeline Section */}
          <div className="border-t pt-4">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Project Timeline</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
              </div>
              <span className="text-sm text-gray-500">
                {formData.teamMembers.length} selected
              </span>
            </div>

            {/* Selected Members Preview */}
            {getSelectedMembers().length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Team Members
                </label>
                <div className="flex flex-wrap gap-2">
                  {getSelectedMembers().map(member => (
                    <div
                      key={member.id}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mr-2">
                        {member.avatar}
                      </span>
                      {member.name}
                      <button
                        type="button"
                        onClick={() => toggleTeamMember(member.id)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Members */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Team Members
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {availableTeamMembers.map(member => (
                <div
                  key={member.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    formData.teamMembers.includes(member.id)
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => toggleTeamMember(member.id)}
                >
                  <input
                    type="checkbox"
                    checked={formData.teamMembers.includes(member.id)}
                    onChange={() => {}}
                    className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-3">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              {initialData ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;