import React, { useState } from 'react';

const InviteModal = ({ team, onClose, onInvite, onCreateTeam }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (team) {
      // Inviting to existing team
      onInvite({
        teamId: team.id,
        email: formData.email,
        role: formData.role
      });
    } else {
      // Creating new team
      onCreateTeam({
        name: formData.name,
        members: formData.email ? [{ email: formData.email, role: formData.role }] : []
      });
    }
    
    onClose();
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="modal-header flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {team ? `Invite to ${team.name}` : 'Create New Team'}
          </h2>
          <button 
            className="text-gray-400 hover:text-gray-600 text-2xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form p-6 space-y-4">
          {!team && (
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter team name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="modal-actions flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {team ? 'Send Invite' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;