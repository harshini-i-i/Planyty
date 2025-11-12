import React from 'react';
import TeamMembers from './TeamMembers';
import TeamProjects from './TeamProjects';

const TeamCard = ({ team, onAddMember, onRemoveMember }) => {
  return (
    <div className="team-card bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="team-header p-4 border-b border-gray-200">
        <div className="team-info">
          <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
          {team.description && (
            <p className="text-sm text-gray-600 mt-1">{team.description}</p>
          )}
        </div>
        <div className="team-actions mt-3">
          <button 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            onClick={() => onAddMember(team)}
          >
            + Add Member
          </button>
        </div>
      </div>
      
      <div className="team-content p-4 space-y-4">
        <TeamMembers 
          members={team.members}
          onRemoveMember={(memberId) => onRemoveMember(team.id, memberId)}
        />
        
        <TeamProjects projects={team.projects} />
      </div>
    </div>
  );
};

export default TeamCard;