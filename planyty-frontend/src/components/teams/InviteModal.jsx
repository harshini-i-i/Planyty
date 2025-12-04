// src/components/teams/InviteModal.jsx
import React, { useState } from 'react';
import { X, Users, Mail, FolderKanban, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

// Mock data for existing projects (same as in TeamCard)
const mockAvailableProjects = [
  { id: 1, name: 'E-commerce Dashboard', description: 'Analytics dashboard for online store' },
  { id: 2, name: 'Admin Panel Redesign', description: 'Redesign of admin interface' },
  { id: 3, name: 'Mobile App Development', description: 'Cross-platform mobile application' },
  { id: 4, name: 'API Integration', description: 'Third-party API integration' },
  { id: 5, name: 'Database Migration', description: 'Migrate from MySQL to PostgreSQL' },
  { id: 6, name: 'Payment System Upgrade', description: 'Upgrade payment processing system' },
  { id: 7, name: 'User Analytics Module', description: 'Advanced user analytics dashboard' },
  { id: 8, name: 'Notification System', description: 'Real-time notification system' },
];

const InviteModal = ({ team, onClose, onInvite, onCreateTeam }) => {
  const { user, isTeamLead } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [''],
    projects: []
  });
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!isTeamLead()) {
      setError('Only team leads can create teams');
      setIsSubmitting(false);
      return;
    }

    try {
      if (team) {
        // Invite to existing team
        const validMembers = formData.members.filter(m => m.trim());
        if (validMembers.length === 0) {
          setError('Please add at least one member');
          setIsSubmitting(false);
          return;
        }

        // Send invitations for each member
        validMembers.forEach(email => {
          onInvite({
            teamId: team.id,
            email: email
          });
        });
      } else {
        // Create new team
        if (!formData.name.trim()) {
          setError('Team name is required');
          setIsSubmitting(false);
          return;
        }

        const validMembers = formData.members.filter(m => m.trim());
        
        await onCreateTeam({
          name: formData.name,
          description: formData.description,
          members: validMembers.map(email => ({ email })),
          projects: formData.projects
        });
      }

      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, '']
    });
  };

  const removeMember = (index) => {
    const newMembers = [...formData.members];
    newMembers.splice(index, 1);
    setFormData({ ...formData, members: newMembers });
  };

  const updateMember = (index, value) => {
    const newMembers = [...formData.members];
    newMembers[index] = value;
    setFormData({ ...formData, members: newMembers });
  };

  // Add project from modal
  const addProject = (project) => {
    // Check if project already exists
    if (!formData.projects.some(p => p.id === project.id)) {
      setFormData({
        ...formData,
        projects: [...formData.projects, { ...project }]
      });
    }
  };

  // Remove project
  const removeProject = (projectId) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter(p => p.id !== projectId)
    });
  };

  // Filter projects that are not already selected
  const availableProjects = mockAvailableProjects.filter(
    project => !formData.projects.some(p => p.id === project.id)
  );

  if (!isTeamLead()) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border-2 border-purple-200 animate-float">
          <div className="flex justify-between items-center p-6 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
            <h2 className="text-xl font-semibold text-purple-800">
              Access Denied
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Permission Required</h3>
              <p className="text-sm text-gray-500">
                Only team leads can create teams and invite members. 
                Please contact your team lead or administrator.
              </p>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-2 border-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-purple-200 animate-float scrollbar-hide">
          <div className="flex justify-between items-center p-6 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
            <h2 className="text-xl font-semibold text-purple-800 animate-pulse-slow">
              {team ? `Invite to ${team.name}` : 'Create New Team'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 animate-bounce-slow"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>

          {error && (
            <div className="m-6">
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Team Name */}
            {!team && (
              <div className="animate-slide-up">
                <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50 transition-all duration-300 hover:scale-105 focus:scale-105"
                  placeholder="Enter team name"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Team Description */}
            {!team && (
              <div className="animate-slide-up delay-100">
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50 transition-all duration-300 hover:scale-105 focus:scale-105"
                  placeholder="Describe what this team will work on"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Team Members */}
            <div className="animate-slide-up delay-200">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-purple-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  {team ? 'Invite Members *' : 'Add Team Members *'}
                </label>
                <Button 
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1"
                  onClick={addMember}
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4" /> Add Email
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.members.map((email, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateMember(index, e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50 transition-all duration-300"
                        placeholder="member@example.com"
                        required={index === 0}
                        disabled={isSubmitting}
                      />
                    </div>
                    {formData.members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-all duration-300 hover:scale-110"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Assign Projects Section (Only for new team creation) */}
            {!team && (
              <div className="animate-slide-up delay-300">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-purple-700 flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-purple-600" />
                    Assign Existing Projects (Optional)
                  </label>
                  
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition-all duration-300"
                    onClick={() => setShowProjectModal(true)}
                    disabled={isSubmitting}
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>
                
                {/* Selected Projects Display */}
                {formData.projects.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formData.projects.map(project => (
                        <div key={project.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-purple-800 truncate">
                              {project.name}
                            </div>
                            {project.description && (
                              <div className="text-xs text-purple-600 truncate">
                                {project.description}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProject(project.id)}
                            className="p-1 hover:bg-red-100 rounded-full transition-all duration-300 hover:scale-110 ml-2"
                            disabled={isSubmitting}
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.projects.length} project{formData.projects.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 animate-slide-up delay-400">
              <Button
                type="button"
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-2 border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-2 border-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg animate-pulse-slow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {team ? 'Send Invites' : 'Create Team'} 🚀
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Project Assignment Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden border-2 border-purple-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <h2 className="text-xl font-semibold text-purple-800">
                Assign Projects to Team
              </h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-2 hover:bg-red-100 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Projects */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    Available Projects ({availableProjects.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {availableProjects.length === 0 ? (
                      <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-lg">
                        All projects are already selected
                      </div>
                    ) : (
                      availableProjects.map(project => (
                        <div 
                          key={project.id} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
                          onClick={() => addProject(project)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800">
                              {project.name}
                            </div>
                            {project.description && (
                              <div className="text-xs text-gray-500 mt-1">
                                {project.description}
                              </div>
                            )}
                          </div>
                          <Plus className="w-5 h-5 text-purple-500 flex-shrink-0 ml-3" />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Currently Selected Projects */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    Selected Projects ({formData.projects.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {formData.projects.length === 0 ? (
                      <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-lg">
                        No projects selected yet
                      </div>
                    ) : (
                      formData.projects.map(project => (
                        <div 
                          key={project.id} 
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-purple-800">
                              {project.name}
                            </div>
                            {project.description && (
                              <div className="text-xs text-purple-600 mt-1">
                                {project.description}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeProject(project.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-all duration-200 ml-2"
                            title="Remove project"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowProjectModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InviteModal;