// src/components/teams/TeamManagement.jsx
import React, { useState, useEffect } from 'react';
import { useTeams } from '../../hooks/useTeams';
import { useAuth } from '../../contexts/AuthContext';
import TeamCard from './TeamCard';
import InviteModal from './InviteModal';
import { Plus, Crown, User } from 'lucide-react';

const TeamManagement = () => {
  const { user, isTeamLead } = useAuth();
  const { teams, createTeam, inviteMember, removeMember, updateTeam } = useTeams();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [userTeams, setUserTeams] = useState([]);

  // Update userTeams whenever teams or user changes
  useEffect(() => {
    if (user && teams) {
      // Filter teams where user is a member
      const filteredTeams = teams.filter(team => 
        team.members.some(member => member.email === user.email)
      );
      setUserTeams(filteredTeams);
    }
  }, [teams, user]);

  // Function to handle member removal
  const handleRemoveMember = (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        removeMember(memberId);
        sendNotification('team', 'Member Removed', 'A team member has been removed');
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // Function to handle team creation
  const handleCreateTeam = (teamData) => {
    try {
      const newTeam = createTeam(teamData);
      sendNotification('team', 'Team Created', 
        `Created team "${teamData.name}" with ${teamData.members.length} member(s)`);
      setShowInviteModal(false);
      return newTeam;
    } catch (error) {
      alert(error.message);
    }
  };

  // Function to handle member invitation
  const handleInviteMember = (inviteData) => {
    try {
      inviteMember(inviteData);
      sendNotification('invite', 'Invitation Sent', 
        `Invited ${inviteData.email} to team`);
      setShowInviteModal(false);
      setSelectedTeam(null);
    } catch (error) {
      alert(error.message);
    }
  };

  // Function to handle team updates
  const handleUpdateTeam = (teamId, updates) => {
    try {
      updateTeam(teamId, updates);
      sendNotification('team', 'Team Updated', 
        `Updated team "${updates.name || 'Team'}"`);
    } catch (error) {
      alert(error.message);
    }
  };

  // Function to handle adding a member (opens invite modal)
  const handleAddMember = (team) => {
    setSelectedTeam(team);
    setShowInviteModal(true);
  };

  // Helper function to send notifications
  const sendNotification = (type, title, message) => {
    const notifications = JSON.parse(localStorage.getItem('planyty_notifications') || '[]');
    const newNotification = {
      id: Date.now(),
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      read: false,
      type
    };
    
    notifications.unshift(newNotification);
    localStorage.setItem('planyty_notifications', JSON.stringify(notifications));
    
    // Trigger notification bell update
    const event = new CustomEvent('notificationUpdate');
    window.dispatchEvent(event);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3] rounded-2xl shadow-2xl shadow-purple-200/50 overflow-hidden">
      {/* COMPACT HEADER */}
      <div className="flex-shrink-0 p-4 border-b border-purple-200 bg-white">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isTeamLead() 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                }`}>
                  <span className="mr-2">
                    {isTeamLead() ? <Crown className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  </span>
                  {isTeamLead() ? 'Team Lead' : 'Team Member'}
                </div>
                <div className="text-sm text-gray-600">
                  {userTeams.length} team{userTeams.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Create Team Button */}
          <div>
            {isTeamLead() && (
              <button 
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-purple-200 hover:shadow-purple-300"
                onClick={() => {
                  setSelectedTeam(null);
                  setShowInviteModal(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Create Team
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Teams Grid Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userTeams.map(team => (
              <TeamCard 
                key={team.id}
                team={team}
                onAddMember={
                  isTeamLead() && team.leadId === user?.id 
                    ? () => handleAddMember(team)
                    : undefined
                }
                onRemoveMember={
                  isTeamLead() && team.leadId === user?.id 
                    ? handleRemoveMember 
                    : undefined
                }
                onUpdateTeam={
                  isTeamLead() && team.leadId === user?.id 
                    ? handleUpdateTeam 
                    : undefined
                }
                canEdit={isTeamLead() && team.leadId === user?.id}
              />
            ))}
            
            {/* Empty State */}
            {userTeams.length === 0 && (
              <div className="col-span-full">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-dashed border-purple-300 p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {isTeamLead() ? 'No teams created yet' : 'Not assigned to any teams yet'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isTeamLead() 
                      ? 'Create your first team to start collaborating' 
                      : 'You will be added to teams by your team lead'}
                  </p>
                  {isTeamLead() && (
                    <button 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-purple-200"
                      onClick={() => {
                        setSelectedTeam(null);
                        setShowInviteModal(true);
                      }}
                    >
                      Create First Team
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          team={selectedTeam}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedTeam(null);
          }}
          onInvite={handleInviteMember}
          onCreateTeam={handleCreateTeam}
        />
      )}
    </div>
  );
};

export default TeamManagement;