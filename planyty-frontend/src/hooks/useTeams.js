// src/hooks/useTeams.js
import { useState, useEffect } from 'react';
import { mockTeams } from '../data/mockTeams';

export const useTeams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    setTeams(mockTeams);
  }, []);

  const createTeam = async (teamData) => {
    // TODO: Replace with actual API call
    const newTeam = {
      id: Date.now(),
      ...teamData,
      members: teamData.members || [],
      projects: []
    };
    setTeams(prev => [...prev, newTeam]);
    return newTeam;
  };

  const inviteMember = async (inviteData) => {
    // TODO: Replace with actual API call
    console.log('Inviting member:', inviteData);
  };

  const removeMember = async (teamId, memberId) => {
    // TODO: Replace with actual API call
    console.log('Removing member:', teamId, memberId);
  };

  return {
    teams,
    createTeam,
    inviteMember,
    removeMember
  };
};