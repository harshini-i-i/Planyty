import React, { useState } from 'react';
import { useTeams } from '../../hooks/useTeams';
import TeamCard from './TeamCard';
import InviteModal from './InviteModal';

const TeamManagement = () => {
  const { teams, createTeam, inviteMember, removeMember } = useTeams();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <div className="team-management max-w-7xl mx-auto">
      <div className="header flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={() => setShowInviteModal(true)}
        >
          + Create New Team
        </button>
      </div>

      {/* Teams Grid */}
      <div className="teams-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <TeamCard 
            key={team.id}
            team={team}
            onAddMember={(team) => {
              setSelectedTeam(team);
              setShowInviteModal(true);
            }}
            onRemoveMember={removeMember}
          />
        ))}
        
        {/* Empty State */}
        {teams.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No teams created yet</h3>
              <p className="text-gray-600 mb-4">Create your first team to start collaborating</p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setShowInviteModal(true)}
              >
                Create Team
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          team={selectedTeam}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedTeam(null);
          }}
          onInvite={inviteMember}
          onCreateTeam={createTeam}
        />
      )}
    </div>
  );
};

export default TeamManagement;