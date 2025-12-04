// src/components/teams/TeamCard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Users, FolderKanban, Edit2, X, Trash2, Check } from 'lucide-react';

// Mock data for available projects
const mockAvailableProjects = [
  { id: 1, name: 'E-commerce Dashboard', description: 'Analytics dashboard for online store' },
  { id: 2, name: 'Admin Panel Redesign', description: 'Redesign of admin interface' },
  { id: 3, name: 'Mobile App Development', description: 'Cross-platform mobile application' },
  { id: 4, name: 'API Integration', description: 'Third-party API integration' },
  { id: 5, name: 'Database Migration', description: 'Migrate from MySQL to PostgreSQL' },
  { id: 6, name: 'Payment System Upgrade', description: 'Upgrade payment processing system' },
  { id: 7, name: 'User Analytics Module', description: 'Advanced user analytics dashboard' },
  { id: 8, name: 'Notification System', description: 'Real-time notification system' },
  { id: 9, name: 'Chat Application', description: 'Real-time messaging platform' },
  { id: 10, name: 'Document Management', description: 'Document storage and sharing system' },
];

const TeamCard = ({ team, onAddMember, onRemoveMember, onUpdateTeam, canEdit = true }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeam, setEditedTeam] = useState({ ...team });
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [availableProjects, setAvailableProjects] = useState([]);
  
  const isTeamLeadOfThisTeam = team.leadId === user?.id;
  const canAddMembers = canEdit && isTeamLeadOfThisTeam;

  // Initialize available projects (filtering out already assigned ones)
  useEffect(() => {
    const assignedProjectIds = new Set(editedTeam.projects.map(p => p.id));
    const filteredProjects = mockAvailableProjects.filter(
      project => !assignedProjectIds.has(project.id)
    );
    setAvailableProjects(filteredProjects);
  }, [editedTeam.projects]);

  const handleSave = () => {
    onUpdateTeam(team.id, editedTeam);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTeam({ ...team });
    setIsEditing(false);
  };

  // Assign an existing project from available projects
  const assignProject = (project) => {
    setEditedTeam({
      ...editedTeam,
      projects: [...editedTeam.projects, { ...project }]
    });
    
    // Remove from available projects
    setAvailableProjects(prev => prev.filter(p => p.id !== project.id));
  };

  // Remove project from team
  const removeProject = (projectId) => {
    const projectToRemove = editedTeam.projects.find(p => p.id === projectId);
    
    setEditedTeam({
      ...editedTeam,
      projects: editedTeam.projects.filter(p => p.id !== projectId)
    });
    
    // Add back to available projects if it exists in mock data
    if (projectToRemove && mockAvailableProjects.some(p => p.id === projectId)) {
      setAvailableProjects(prev => [...prev, projectToRemove]);
    }
  };

  return (
    <div className={`team-card bg-white rounded-xl shadow-lg border ${
      isTeamLeadOfThisTeam 
        ? 'border-purple-300 shadow-purple-200/50' 
        : 'border-gray-200 shadow-gray-200/50'
    } hover:shadow-xl hover:shadow-purple-200/30 transition-all duration-300 overflow-hidden flex flex-col`}>
      
      {/* Header */}
      <div className={`p-4 ${
        isTeamLeadOfThisTeam 
          ? 'bg-gradient-to-r from-purple-50 to-pink-50' 
          : 'bg-gradient-to-r from-gray-50 to-blue-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 truncate">
              {team.name}
            </h3>
            {team.description && (
              <p className="text-sm text-gray-600 truncate mt-1">{team.description}</p>
            )}
          </div>
          
          {/* Edit Button (only show when not editing) */}
          {canEdit && isTeamLeadOfThisTeam && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 hover:scale-105 transition-transform"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        {/* Members Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="w-4 h-4 text-purple-500" />
              <span>Members ({team.members.length})</span>
            </div>
            
            {/* Show Add Member button only in edit mode */}
            {isEditing && canAddMembers && onAddMember && (
              <button
                onClick={() => onAddMember(team)}
                className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            )}
          </div>
          
          <div className="max-h-24 overflow-y-auto pr-2 space-y-1">
            {team.members.map(member => (
              <div key={member.id} className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                    {member.name?.charAt(0)?.toUpperCase() || member.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {member.name || member.email.split('@')[0]}
                      {member.id === user?.id && (
                        <span className="text-xs text-purple-600 ml-1">(You)</span>
                      )}
                      {member.role === 'lead' && (
                        <span className="text-xs text-purple-600 ml-1">(Lead)</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {member.email}
                    </div>
                  </div>
                </div>
                {/* Show X button only in edit mode and not for lead/current user */}
                {isEditing && canEdit && isTeamLeadOfThisTeam && member.role !== 'lead' && member.id !== user?.id && (
                  <button
                    onClick={() => onRemoveMember(member.id)}
                    className="p-1 hover:bg-red-100 rounded transition-all duration-200"
                    title="Remove member"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Projects Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FolderKanban className="w-4 h-4 text-pink-500" />
              <span>Assigned Projects ({team.projects.length})</span>
            </div>
            {/* Show Add Project button only in edit mode */}
            {isEditing && canEdit && isTeamLeadOfThisTeam && (
              <button
                onClick={() => setShowProjectModal(true)}
                className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            )}
          </div>
          
          <div className="max-h-24 overflow-y-auto pr-2">
            {team.projects.length === 0 ? (
              <div className="text-center py-3 text-sm text-gray-500 bg-gray-50 rounded-lg">
                No projects assigned to this team
              </div>
            ) : (
              team.projects.map(project => (
                <div key={project.id} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800 truncate">{project.name}</div>
                    {project.description && (
                      <div className="text-xs text-gray-500 truncate">{project.description}</div>
                    )}
                  </div>
                  {/* Show trash icon only in edit mode */}
                  {isEditing && canEdit && isTeamLeadOfThisTeam && (
                    <button
                      onClick={() => removeProject(project.id)}
                      className="p-1.5 hover:bg-red-100 rounded transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Remove project"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md shadow-purple-200 flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            {team.members.length} members • {team.projects.length} projects
          </div>
        )}
      </div>

      {/* Project Assignment Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border-2 border-purple-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <h2 className="text-xl font-semibold text-purple-800">
                Assign Projects to {team.name}
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
                        All projects are already assigned
                      </div>
                    ) : (
                      availableProjects.map(project => (
                        <div 
                          key={project.id} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
                          onClick={() => assignProject(project)}
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

                {/* Currently Assigned Projects */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    Currently Assigned ({editedTeam.projects.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {editedTeam.projects.length === 0 ? (
                      <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-lg">
                        No projects assigned yet
                      </div>
                    ) : (
                      editedTeam.projects.map(project => (
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
    </div>
  );
};

export default TeamCard;