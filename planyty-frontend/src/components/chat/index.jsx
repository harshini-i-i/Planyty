import React, { useState, useEffect, useCallback, useRef } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import { useNotifications } from '../../contexts/NotificationContext';
import { FakeServer } from '../../fake-backend/fakeServer';

const Chat = () => {
  const [activeTab, setActiveTab] = useState('channels');
  const [activeChannel, setActiveChannel] = useState('general');
  const [activeTeam, setActiveTeam] = useState(null);
  const [messages, setMessages] = useState({});
  const [teams, setTeams] = useState([]);
  const [socketStatus, setSocketStatus] = useState('connected');
  const [channels, setChannels] = useState([]);
  
  // Use refs to track message IDs to prevent duplicates
  const processedMessageIds = useRef(new Set());
  const isSendingMessage = useRef(false);

  const { addNotification } = useNotifications();

  // Initialize channels, teams, and initial messages
  useEffect(() => {
    // Load channels from fake backend
    const loadedChannels = FakeServer.getChannels();
    setChannels(loadedChannels);
    
    // Load teams from fake backend
    const loadedTeams = FakeServer.getTeams();
    setTeams(loadedTeams);
    
    // Initialize messages for all existing chats
    const initialMessages = {};
    
    // Load messages for each channel
    loadedChannels.forEach(channel => {
      initialMessages[channel.id] = FakeServer.getMessages(channel.id);
      // Track existing message IDs
      initialMessages[channel.id].forEach(msg => {
        processedMessageIds.current.add(msg.id);
      });
    });
    
    // Load messages for each team
    loadedTeams.forEach(team => {
      initialMessages[team.id] = FakeServer.getMessages(team.id);
      // Track existing message IDs
      initialMessages[team.id].forEach(msg => {
        processedMessageIds.current.add(msg.id);
      });
    });
    
    // Add DMs
    const dmIds = ['dm_john'];
    dmIds.forEach(dmId => {
      initialMessages[dmId] = FakeServer.getMessages(dmId);
      initialMessages[dmId].forEach(msg => {
        processedMessageIds.current.add(msg.id);
      });
    });
    
    setMessages(initialMessages);
  }, []);

  // Simulate incoming messages from FakeServer
  useEffect(() => {
    let isMounted = true;
    let lastMessageTime = Date.now();
    
    const simulateMessage = () => {
      if (!isMounted) return;
      if (isSendingMessage.current) return; // Don't simulate while user is sending
      
      const now = Date.now();
      const timeSinceLastMessage = now - lastMessageTime;
      
      // Only simulate if it's been at least 8 seconds since last message
      if (timeSinceLastMessage < 8000) return;
      
      const incoming = FakeServer.getRandomMessage(activeChannel);
      
      if (incoming && incoming.sender !== 'You') {
        // Check if we've already processed this message ID
        if (processedMessageIds.current.has(incoming.id)) {
          return;
        }
        
        processedMessageIds.current.add(incoming.id);
        lastMessageTime = now;
        
        setMessages(prev => {
          const currentMessages = prev[activeChannel] || [];
          
          return {
            ...prev,
            [activeChannel]: [...currentMessages, incoming]
          };
        });

        // Store in fake backend
        FakeServer.addMessage(activeChannel, incoming);

        // Add notification
        addNotification({
          title: `New message in #${activeChannel}`,
          message: `${incoming.sender}: ${incoming.text.length > 50 ? incoming.text.substring(0, 50) + '...' : incoming.text}`,
          type: 'message'
        });
      }
    };

    const interval = setInterval(() => {
      simulateMessage();
    }, 1000); // Check every second, but only send if conditions are met
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeChannel, addNotification]);

  const handleSendMessage = useCallback((messageData) => {
    // Set sending flag to prevent simulated messages
    isSendingMessage.current = true;
    
    const messageId = Date.now() + Math.random();
    const newMessage = {
      id: messageId,
      sender: 'You',
      text: messageData.text,
      timestamp: messageData.timestamp || new Date().toISOString(),
      type: messageData.type || 'text',
      file: messageData.file,
      read: true,
      replyTo: messageData.replyTo // Add replyTo data
    };

    // Track this message ID
    processedMessageIds.current.add(messageId);

    // Update local state
    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMessage]
    }));

    // Store in fake backend
    FakeServer.addMessage(activeChannel, newMessage);
    
    // Clear sending flag after a delay
    setTimeout(() => {
      isSendingMessage.current = false;
    }, 1000);
  }, [activeChannel]);

  // Add this function to handle message deletion
  const handleDeleteMessage = useCallback((messageId, forEveryone = false) => {
    setMessages(prev => {
      const updated = { ...prev };
      if (updated[activeChannel]) {
        updated[activeChannel] = updated[activeChannel].filter(msg => msg.id !== messageId);
      }
      return updated;
    });

    FakeServer.deleteMessage(activeChannel, messageId, forEveryone);
    
    addNotification({
      title: 'Message Deleted',
      message: forEveryone ? 'Message deleted for everyone' : 'Message deleted for you',
      type: 'info'
    });
  }, [activeChannel, addNotification]);

  // Add this function to handle reactions
  const handleAddReaction = useCallback((messageId, emoji) => {
    setMessages(prev => {
      const updated = { ...prev };
      if (updated[activeChannel]) {
        updated[activeChannel] = updated[activeChannel].map(msg => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || {};
            const userReaction = reactions[emoji] || [];
            
            if (userReaction.includes('You')) {
              // Remove reaction
              const updatedReaction = userReaction.filter(u => u !== 'You');
              if (updatedReaction.length === 0) {
                delete reactions[emoji];
              } else {
                reactions[emoji] = updatedReaction;
              }
            } else {
              // Add reaction
              reactions[emoji] = [...userReaction, 'You'];
            }
            
            return { ...msg, reactions };
          }
          return msg;
        });
      }
      return updated;
    });

    FakeServer.addReaction(activeChannel, messageId, emoji, 'You');
  }, [activeChannel]);

  const handleNewChannel = useCallback((channelData) => {
    const newChannel = {
      id: channelData.name.toLowerCase().replace(/\s+/g, '-'),
      name: channelData.name,
      private: channelData.private || false
    };
    
    // Add to fake backend
    const addedChannel = FakeServer.addChannel(newChannel);
    
    if (addedChannel) {
      // Get updated channels list from FakeServer
      const updatedChannels = FakeServer.getChannels();
      setChannels(updatedChannels);
      
      // Initialize empty messages for new channel
      setMessages(prev => ({
        ...prev,
        [addedChannel.id]: []
      }));
      
      // Switch to new channel
      setActiveChannel(addedChannel.id);
      setActiveTab('channels');
      setActiveTeam(null);
      
      addNotification({
        title: 'Channel Created',
        message: `Created ${channelData.private ? 'private' : 'public'} channel: #${channelData.name}`,
        type: 'task'
      });
      
      return true;
    }
    
    return false;
  }, [addNotification]);

  const handleNewDirectMessage = () => {
    addNotification({
      title: 'Direct Message',
      message: 'Start new direct message feature is coming soon!',
      type: 'info'
    });
  };

  const handleChannelSelect = useCallback((channelId) => {
    setActiveChannel(channelId);
    setActiveTeam(null);
    setActiveTab('channels');
    
    // Reset unread count for this channel
    FakeServer.resetUnread(channelId);
  }, []);

  const handleTeamSelect = useCallback((teamId) => {
    setActiveChannel(teamId);
    setActiveTeam(teamId);
    setActiveTab('teams');
    
    // Reset unread count for this team
    FakeServer.resetUnread(teamId);
  }, []);

  const handleCreateTeam = useCallback((teamData) => {
    const newTeam = {
      id: teamData.name.toLowerCase().replace(/\s+/g, '-'),
      name: teamData.name
    };
    
    // Add to fake backend
    const addedTeam = FakeServer.addTeam(newTeam);
    
    if (addedTeam) {
      // Get updated teams list from FakeServer
      const updatedTeams = FakeServer.getTeams();
      setTeams(updatedTeams);
      
      // Initialize welcome messages for new team
      const welcomeMessages = [
        {
          id: Date.now() + Math.random(),
          sender: 'System',
          text: `Welcome to the ${teamData.name} team chat!`,
          timestamp: new Date().toISOString(),
          type: 'system'
        },
        {
          id: Date.now() + Math.random() + 1,
          sender: 'System',
          text: teamData.description || 'No description provided.',
          timestamp: new Date().toISOString(),
          type: 'system'
        },
        {
          id: Date.now() + Math.random() + 2,
          sender: 'You',
          text: `Team "${teamData.name}" has been created!`,
          timestamp: new Date().toISOString(),
          type: 'text'
        }
      ];
      
      // Track message IDs
      welcomeMessages.forEach(msg => {
        processedMessageIds.current.add(msg.id);
      });
      
      setMessages(prev => ({
        ...prev,
        [addedTeam.id]: welcomeMessages
      }));
      
      // Store in fake backend
      welcomeMessages.forEach(msg => {
        FakeServer.addMessage(addedTeam.id, msg);
      });
      
      // Switch to new team
      setActiveChannel(addedTeam.id);
      setActiveTeam(addedTeam.id);
      setActiveTab('teams');
      
      addNotification({
        title: 'Team Created!',
        message: `Team "${teamData.name}" has been created.`,
        type: 'task'
      });
      
      return true;
    }
    
    return false;
  }, [addNotification]);

  // Get unread counts for sidebar
  const getUnreadCount = useCallback((chatId) => {
    return FakeServer.getUnread(chatId);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3] rounded-2xl shadow-2xl shadow-purple-200/50 overflow-hidden">
      <div className="h-full">
        <div className="h-full flex bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <ChatSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activeChannel={activeChannel}
            onChannelSelect={handleChannelSelect}
            activeTeam={activeTeam}
            onTeamSelect={handleTeamSelect}
            onNewChannel={handleNewChannel}
            onNewDirectMessage={handleNewDirectMessage}
            channels={channels}
            teams={teams}
            onCreateTeam={handleCreateTeam}
            getUnreadCount={getUnreadCount}
          />
          
          <ChatMessages
            currentChat={activeChannel}
            messages={messages[activeChannel] || []}
            onSendMessage={handleSendMessage}
            onDeleteMessage={handleDeleteMessage} // ADD THIS
            onAddReaction={handleAddReaction} // ADD THIS
            socketStatus={socketStatus}
            currentUser="You"
            teams={teams}
            channels={channels}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;