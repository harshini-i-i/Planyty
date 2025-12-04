// src/hooks/useTeams.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useTeams = () => {
  const { user, isTeamLead } = useAuth();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Load teams based on user role
    const loadTeamsForUser = () => {
      if (!user) return [];

      if (isTeamLead()) {
        // For Team Lead: Show teams they lead + any created teams
        const teamLeadTeams = [
          {
            id: 1,
            name: 'Frontend Development',
            description: 'React, Vue, and Angular projects',
            createdBy: user.id,
            leadId: user.id,
            members: [
              { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: 'lead' 
              },
              { 
                id: 2, 
                name: 'Emma Wilson', 
                email: 'emma.wilson@example.com', 
                role: 'member' 
              },
              { 
                id: 3, 
                name: 'David Lee', 
                email: 'david.lee@example.com', 
                role: 'member' 
              }
            ],
            projects: [
              { 
                id: 1, 
                name: 'E-commerce Dashboard', 
                status: 'in-progress' 
              },
              { 
                id: 2, 
                name: 'Admin Panel Redesign', 
                status: 'planning' 
              }
            ]
          },
          {
            id: 2,
            name: 'Mobile Development',
            description: 'iOS and Android app development',
            createdBy: user.id,
            leadId: user.id,
            members: [
              { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: 'lead' 
              },
              { 
                id: 4, 
                name: 'Ryan Cooper', 
                email: 'ryan.cooper@example.com', 
                role: 'member' 
              }
            ],
            projects: [
              { 
                id: 3, 
                name: 'Fitness Tracker App', 
                status: 'in-progress' 
              }
            ]
          }
        ];
        
        // Add any created teams from localStorage if they exist
        const savedTeams = localStorage.getItem('planyty_teams');
        if (savedTeams) {
          const userCreatedTeams = JSON.parse(savedTeams).filter(
            team => team.createdBy === user.id
          );
          return [...teamLeadTeams, ...userCreatedTeams];
        }
        
        return teamLeadTeams;
      } else {
        // For Regular Member: Show teams they're a member of
        return [
          {
            id: 3,
            name: 'Design Team',
            description: 'UI/UX design and prototyping',
            createdBy: 1001,
            leadId: 1001,
            members: [
              { 
                id: 1001, 
                name: 'Alex Johnson', 
                email: 'alex.johnson@example.com', 
                role: 'lead' 
              },
              { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: 'member' 
              }
            ],
            projects: [
              { 
                id: 4, 
                name: 'Website UI Redesign', 
                status: 'in-progress' 
              }
            ]
          },
          {
            id: 4,
            name: 'QA & Testing',
            description: 'Quality assurance and testing team',
            createdBy: 1001,
            leadId: 1001,
            members: [
              { 
                id: 1001, 
                name: 'Alex Johnson', 
                email: 'alex.johnson@example.com', 
                role: 'lead' 
              },
              { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: 'member' 
              }
            ],
            projects: [
              { 
                id: 5, 
                name: 'Automated Testing Suite', 
                status: 'planning' 
              }
            ]
          }
        ];
      }
    };

    const userTeams = loadTeamsForUser();
    setTeams(userTeams);
  }, [user, isTeamLead]);

  const createTeam = (teamData) => {
    if (!isTeamLead()) {
      throw new Error('Only team leads can create teams');
    }

    const newTeam = {
      id: Date.now(),
      name: teamData.name,
      description: teamData.description || '',
      createdBy: user.id,
      leadId: user.id,
      members: [
        { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: 'lead' 
        },
        ...(teamData.members || []).map((member, index) => ({
          id: Date.now() + index + 1000,
          name: member.email.split('@')[0],
          email: member.email,
          role: 'member'
        }))
      ],
      projects: teamData.projects || []
    };

    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    
    // Save to localStorage only for team lead's created teams
    const existingCreatedTeams = JSON.parse(localStorage.getItem('planyty_teams') || '[]');
    const userCreatedTeams = existingCreatedTeams.filter(team => team.createdBy === user.id);
    localStorage.setItem('planyty_teams', JSON.stringify([...userCreatedTeams, newTeam]));
    
    return newTeam;
  };

  const inviteMember = (inviteData) => {
    const { teamId, email } = inviteData;
    
    // Check if user is lead of this team
    const team = teams.find(t => t.id === teamId);
    if (!team || team.leadId !== user?.id) {
      throw new Error('Only team leads can invite members to their teams');
    }

    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        const newMember = {
          id: Date.now(),
          email: email,
          name: email.split('@')[0],
          role: 'member'
        };
        return {
          ...team,
          members: [...team.members, newMember]
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    
    // Update localStorage for user-created teams
    if (team.createdBy === user.id) {
      const existingCreatedTeams = JSON.parse(localStorage.getItem('planyty_teams') || '[]');
      const updatedCreatedTeams = existingCreatedTeams.map(t => 
        t.id === teamId ? updatedTeams.find(ut => ut.id === teamId) : t
      );
      localStorage.setItem('planyty_teams', JSON.stringify(updatedCreatedTeams));
    }
  };

  const removeMember = (memberId) => {
    const updatedTeams = teams.map(team => {
      // Only team leads can remove members from their teams
      if (team.leadId === user?.id) {
        // Don't allow removing team lead
        if (memberId === team.leadId) {
          throw new Error('Cannot remove team lead');
        }
        
        return {
          ...team,
          members: team.members.filter(member => member.id !== memberId)
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    
    // Update localStorage for user-created teams
    const existingCreatedTeams = JSON.parse(localStorage.getItem('planyty_teams') || '[]');
    const updatedCreatedTeams = existingCreatedTeams.map(t => 
      t.leadId === user?.id ? updatedTeams.find(ut => ut.id === t.id) : t
    );
    localStorage.setItem('planyty_teams', JSON.stringify(updatedCreatedTeams));
  };

  const updateTeam = (teamId, updates) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return { ...team, ...updates };
      }
      return team;
    });

    setTeams(updatedTeams);
    
    // Update localStorage for user-created teams
    const existingCreatedTeams = JSON.parse(localStorage.getItem('planyty_teams') || '[]');
    const updatedCreatedTeams = existingCreatedTeams.map(t => 
      t.id === teamId ? updatedTeams.find(ut => ut.id === teamId) : t
    );
    localStorage.setItem('planyty_teams', JSON.stringify(updatedCreatedTeams));
  };

  return {
    teams,
    createTeam,
    inviteMember,
    removeMember,
    updateTeam
  };
};