// src/components/chat/index.jsx (updated to use notifications)
import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import { useSocket } from '../../contexts/SocketContext';
import { useNotifications } from '../../contexts/NotificationContext'; 

const Chat = () => {
  const [activeTab, setActiveTab] = useState('channels');
  const [activeChannel, setActiveChannel] = useState('general');
  const [activeTeam, setActiveTeam] = useState(null);
  const [messages, setMessages] = useState({});
  const [teams, setTeams] = useState([]);
  const [socketStatus, setSocketStatus] = useState('connecting');
  
  const { socket, isConnected } = useSocket();
  const { addNotification } = useNotifications(); // Use the notification context

  // Initialize mock messages for different chats
  useEffect(() => {
    const mockMessages = {
      'general': [
        { id: 1, sender: 'System', text: 'Welcome to the #general channel!', timestamp: '2024-01-15T09:00:00Z', type: 'system' },
        { id: 2, sender: 'John Doe', text: 'Good morning everyone! Ready for the standup?', timestamp: '2024-01-15T09:15:00Z', type: 'text' },
        { id: 3, sender: 'You', text: 'Morning! I have the task board ready for review.', timestamp: '2024-01-15T09:16:00Z', type: 'text' },
        { id: 4, sender: 'Jane Smith', text: 'Design system updates are complete 🎨', timestamp: '2024-01-15T09:20:00Z', type: 'text' },
      ],
      'design': [
        { id: 1, sender: 'Jane Smith', text: 'New design mockups are ready for feedback', timestamp: '2024-01-15T10:00:00Z', type: 'text' },
        { id: 2, sender: 'You', text: 'The color scheme looks great! What about mobile responsiveness?', timestamp: '2024-01-15T10:05:00Z', type: 'text' },
      ],
      'frontend-team': [
        { id: 1, sender: 'John Doe', text: 'Let\'s sync on the React migration plan', timestamp: '2024-01-15T11:00:00Z', type: 'text' },
        { id: 2, sender: 'You', text: 'I\'ve prepared the migration roadmap doc', timestamp: '2024-01-15T11:05:00Z', type: 'text', read: true },
      ],
      'dm_john': [
        { id: 1, sender: 'John Doe', text: 'Hey, can you review my PR when you get a chance?', timestamp: '2024-01-15T14:00:00Z', type: 'text' },
        { id: 2, sender: 'You', text: 'Sure, I\'ll take a look in 30 minutes', timestamp: '2024-01-15T14:02:00Z', type: 'text', read: true },
      ],
    };
    
    setMessages(mockMessages);
    
    // Initialize mock teams
    setTeams([
      {
        id: 'frontend-team',
        name: 'Frontend Team',
        description: 'React & Frontend Development',
        unread: 2,
        online: 4,
        members: 8,
        created: '2024-01-10'
      },
      {
        id: 'design-team',
        name: 'Design Team',
        description: 'UI/UX Design Discussions',
        unread: 0,
        online: 3,
        members: 5,
        created: '2024-01-12'
      }
    ]);
  }, []);

  useEffect(() => {
    if (socket) {
      setSocketStatus(isConnected ? 'connected' : 'disconnected');
      
      const handleMessage = (message) => {
        const chatId = message.chatId || activeChannel;
        setMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), {
            id: Date.now(),
            sender: message.sender,
            text: message.text,
            timestamp: new Date().toISOString(),
            type: 'text'
          }]
        }));
        
        // Add notification for new message (only if not from current user)
        if (message.sender !== 'You' && chatId !== activeChannel) {
          addNotification({
            title: `New message from ${message.sender}`,
            message: message.text.length > 50 ? message.text.substring(0, 50) + '...' : message.text,
            type: 'message'
          });
        }
      };
      
      socket.on('chatMessage', handleMessage);
      
      return () => {
        socket.off('chatMessage', handleMessage);
      };
    }
  }, [socket, isConnected, activeChannel, addNotification]);

  const handleSendMessage = (messageData) => {
    const newMessage = {
      id: Date.now(),
      sender: 'You',
      text: messageData.text,
      timestamp: messageData.timestamp,
      type: messageData.type,
      file: messageData.file,
      read: true
    };

    // Update local state
    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMessage]
    }));

    // Send to socket if connected
    if (socket && isConnected) {
      socket.emit('sendMessage', {
        chatId: activeChannel,
        text: messageData.text,
        type: messageData.type,
        file: messageData.file
      });
    }
  };

  const handleNewChannel = (channelData) => {
    console.log('Creating new channel:', channelData);
    
    // Add notification instead of alert
    addNotification({
      title: 'Channel Created',
      message: `Created ${channelData.private ? 'private' : 'public'} channel: #${channelData.name}`,
      type: 'task'
    });
  };

  const handleNewTeamChat = () => {
    console.log('Creating new team chat');
    addNotification({
      title: 'Team Chat',
      message: 'Create new team chat feature is coming soon!',
      type: 'info'
    });
  };

  const handleNewDirectMessage = () => {
    console.log('Starting new direct message');
    addNotification({
      title: 'Direct Message',
      message: 'Start new direct message feature is coming soon!',
      type: 'info'
    });
  };

  const handleChannelSelect = (channelId) => {
    setActiveChannel(channelId);
    setActiveTeam(null);
  };

  const handleTeamSelect = (teamId) => {
    setActiveChannel(teamId);
    setActiveTeam(teamId);
  };

  const handleCreateTeam = (teamData) => {
    console.log('Creating new team:', teamData);
    
    // Create new team object with unique ID
    const newTeam = {
      id: teamData.name.toLowerCase().replace(/\s+/g, '-'),
      name: teamData.name,
      description: teamData.description,
      unread: 0,
      online: 1,
      members: 1,
      created: new Date().toISOString().split('T')[0]
    };
    
    // Add to teams array
    setTeams(prev => [...prev, newTeam]);
    
    // Create initial messages for the new team
    setMessages(prev => ({
      ...prev,
      [newTeam.id]: [
        {
          id: 1,
          sender: 'System',
          text: `Welcome to the ${teamData.name} team chat! This is your dedicated space for team discussions.`,
          timestamp: new Date().toISOString(),
          type: 'system'
        },
        {
          id: 2,
          sender: 'System',
          text: teamData.description 
            ? `Team description: ${teamData.description}`
            : 'No description provided yet.',
          timestamp: new Date().toISOString(),
          type: 'system'
        },
        {
          id: 3,
          sender: 'You',
          text: `Team "${teamData.name}" has been created! Start the conversation. 🎉`,
          timestamp: new Date().toISOString(),
          type: 'text'
        }
      ]
    }));
    
    // Switch to the new team chat
    setActiveChannel(newTeam.id);
    setActiveTeam(newTeam.id);
    
    // Add success notification
    addNotification({
      title: 'Team Created Successfully!',
      message: `Team "${teamData.name}" has been created. You've been added to the team chat.`,
      type: 'task'
    });
  };

  return (
    <div className="h-full flex bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <ChatSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeChannel={activeChannel}
        onChannelSelect={handleChannelSelect}
        activeTeam={activeTeam}
        onTeamSelect={handleTeamSelect}
        onNewChannel={handleNewChannel}
        onNewTeamChat={handleNewTeamChat}
        onNewDirectMessage={handleNewDirectMessage}
        teams={teams}
        onCreateTeam={handleCreateTeam}
      />
      
      <ChatMessages
        currentChat={activeChannel}
        messages={messages[activeChannel] || []}
        onSendMessage={handleSendMessage}
        socketStatus={socketStatus}
        currentUser="You"
      />
    </div>
  );
};

export default Chat;