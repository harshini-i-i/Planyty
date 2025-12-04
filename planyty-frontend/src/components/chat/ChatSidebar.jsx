// src/components/chat/ChatSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Search, Hash, Users, Plus, MessageSquare, Lock, ChevronDown, X, UserPlus, Settings, Clock, Circle, CheckCircle, Moon } from 'lucide-react';

const ChatSidebar = ({ 
  activeTab, 
  onTabChange, 
  activeChannel, 
  onChannelSelect,
  activeTeam,
  onTeamSelect,
  onNewChannel,
  onNewTeamChat,
  onNewDirectMessage,
  teams, // Pass teams from parent
  onCreateTeam // New prop for creating teams
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newChannelPrivate, setNewChannelPrivate] = useState(false);
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    channels: true,
    teams: true,
    direct: true
  });
  
  // Chat settings state
  const [chatSettings, setChatSettings] = useState({
    readReceipts: true,
    typingIndicators: true,
    messagePreviews: true,
    soundNotifications: true,
    desktopNotifications: true,
    activeStatus: 'online',
    theme: 'light'
  });
  
  // Mock data for channels and users (in real app, this would come from API)
  const channels = [
    { id: 'general', name: 'general', description: 'General discussion', unread: 0, private: false, memberCount: 42 },
    { id: 'design', name: 'design', description: 'Design team discussions', unread: 3, private: false, memberCount: 12 },
    { id: 'development', name: 'development', description: 'Development updates', unread: 12, private: false, memberCount: 24 },
    { id: 'announcements', name: 'announcements', description: 'Important announcements', unread: 0, private: false, memberCount: 42 },
  ];

  const directMessages = [
    { id: 'john', name: 'John Doe', role: 'Frontend Lead', status: 'online', unread: 3, lastSeen: '2 min ago' },
    { id: 'jane', name: 'Jane Smith', role: 'Design Lead', status: 'online', unread: 0, lastSeen: 'Just now' },
    { id: 'mike', name: 'Mike Johnson', role: 'Backend Dev', status: 'away', unread: 0, lastSeen: '30 min ago' },
    { id: 'sarah', name: 'Sarah Wilson', role: 'Product Manager', status: 'offline', unread: 1, lastSeen: '2 hours ago' },
  ];

  // Use teams from props or show empty state
  const teamChats = teams || [];

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      onNewChannel({
        name: newChannelName.trim(),
        private: newChannelPrivate,
        description: `Channel for ${newChannelName.trim()} discussions`
      });
      setNewChannelName('');
      setNewChannelPrivate(false);
      setShowCreateChannel(false);
    }
  };

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      onCreateTeam({
        name: newTeamName.trim(),
        description: newTeamDescription.trim()
      });
      setNewTeamName('');
      setNewTeamDescription('');
      setShowCreateTeam(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getActiveStatusIcon = (status) => {
    switch (status) {
      case 'online': return <Circle className="w-3 h-3 text-green-500" />;
      case 'away': return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'busy': return <Circle className="w-3 h-3 text-red-500" />;
      case 'offline': return <Moon className="w-3 h-3 text-gray-400" />;
      default: return <Circle className="w-3 h-3 text-green-500" />;
    }
  };

  const handleSettingChange = (setting, value) => {
    setChatSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const activeStatusOptions = [
    { value: 'online', label: 'Online', color: 'text-green-500', bgColor: 'bg-green-100' },
    { value: 'away', label: 'Away', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    { value: 'busy', label: 'Do Not Disturb', color: 'text-red-500', bgColor: 'bg-red-100' },
    { value: 'offline', label: 'Invisible', color: 'text-gray-500', bgColor: 'bg-gray-100' },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Chat
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateTeam(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Create Team"
            >
              <UserPlus className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setShowCreateChannel(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Create Channel"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channels, teams, people..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-96 border-2 border-purple-200">
            <div className="p-4 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-purple-800">Create New Channel</h3>
                <button 
                  onClick={() => setShowCreateChannel(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g., project-updates"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="private-channel"
                  checked={newChannelPrivate}
                  onChange={(e) => setNewChannelPrivate(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="private-channel" className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Make channel private (invite only)
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCreateChannel(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateChannel}
                  disabled={!newChannelName.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  Create Channel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeam && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-96 border-2 border-purple-200">
            <div className="p-4 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-purple-800">Create New Team</h3>
                <button 
                  onClick={() => setShowCreateTeam(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g., Frontend Development"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="What will this team work on?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-600 mb-2">
                  A dedicated chat will be created for this team
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateTeam(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTeam}
                    disabled={!newTeamName.trim()}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    Create Team & Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-96 border-2 border-purple-200">
            <div className="p-4 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-purple-800">Chat Settings</h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Active Status */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Active Status</h4>
                <div className="space-y-2">
                  {activeStatusOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSettingChange('activeStatus', option.value)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                        chatSettings.activeStatus === option.value
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getActiveStatusIcon(option.value)}
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </div>
                      {chatSettings.activeStatus === option.value && (
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Privacy</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Read receipts</div>
                      <div className="text-xs text-gray-500">Let others see when you've read their messages</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chatSettings.readReceipts}
                        onChange={(e) => handleSettingChange('readReceipts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Typing indicators</div>
                      <div className="text-xs text-gray-500">Show when others are typing</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chatSettings.typingIndicators}
                        onChange={(e) => handleSettingChange('typingIndicators', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Message previews</div>
                      <div className="text-xs text-gray-500">Show message content in notifications</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chatSettings.messagePreviews}
                        onChange={(e) => handleSettingChange('messagePreviews', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Sound notifications</div>
                      <div className="text-xs text-gray-500">Play sounds for new messages</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chatSettings.soundNotifications}
                        onChange={(e) => handleSettingChange('soundNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Desktop notifications</div>
                      <div className="text-xs text-gray-500">Show desktop notifications</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chatSettings.desktopNotifications}
                        onChange={(e) => handleSettingChange('desktopNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Theme */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Theme</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSettingChange('theme', 'light')}
                    className={`flex-1 py-2 rounded-lg border ${
                      chatSettings.theme === 'light'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => handleSettingChange('theme', 'dark')}
                    className={`flex-1 py-2 rounded-lg border ${
                      chatSettings.theme === 'dark'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-2 px-4 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-300"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Channels Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => toggleSection('channels')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.channels ? 'rotate-0' : '-rotate-90'}`} />
              Channels
              <span className="text-xs text-gray-500 ml-1">({channels.length})</span>
            </button>
            <button
              onClick={() => setShowCreateChannel(true)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {expandedSections.channels && (
            <div className="space-y-1 ml-6">
              {channels.map(channel => (
                <div
                  key={channel.id}
                  onClick={() => onChannelSelect(channel.id)}
                  className={`p-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between ${
                    activeChannel === channel.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {channel.private ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <Hash className="w-3.5 h-3.5" />
                    )}
                    <div className="font-medium text-sm">#{channel.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {channel.unread > 0 && (
                      <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full min-w-6 text-center ${
                        activeChannel === channel.id
                          ? 'bg-white text-purple-600'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {channel.unread > 9 ? '9+' : channel.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Chats Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => toggleSection('teams')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.teams ? 'rotate-0' : '-rotate-90'}`} />
              Team Chats
              <span className="text-xs text-gray-500 ml-1">({teamChats.length})</span>
            </button>
            <button
              onClick={() => setShowCreateTeam(true)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {expandedSections.teams && (
            <div className="space-y-1 ml-6">
              {teamChats.length === 0 ? (
                <div className="p-3 text-center text-sm text-gray-500 bg-gray-50 rounded-lg">
                  No team chats yet
                  <button
                    onClick={() => setShowCreateTeam(true)}
                    className="block mt-2 text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Create your first team
                  </button>
                </div>
              ) : (
                teamChats.map(team => (
                  <div
                    key={team.id}
                    onClick={() => onTeamSelect(team.id)}
                    className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      activeTeam === team.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" />
                        <div className="font-medium text-sm">{team.name}</div>
                      </div>
                      {team.unread > 0 && (
                        <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full min-w-6 text-center ${
                          activeTeam === team.id
                            ? 'bg-white text-purple-600'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {team.unread > 9 ? '9+' : team.unread}
                        </span>
                      )}
                    </div>
                    <div className={`text-xs flex items-center gap-2 ${activeTeam === team.id ? 'text-purple-100' : 'text-gray-500'}`}>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {team.online || 0} online
                      </span>
                      • {team.members?.length || 0} members
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Direct Messages Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => toggleSection('direct')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.direct ? 'rotate-0' : '-rotate-90'}`} />
              Direct Messages
              <span className="text-xs text-gray-500 ml-1">({directMessages.length})</span>
            </button>
            <button
              onClick={onNewDirectMessage}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {expandedSections.direct && (
            <div className="space-y-1 ml-6">
              {directMessages.map(user => (
                <div
                  key={user.id}
                  onClick={() => onChannelSelect(`dm_${user.id}`)}
                  className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeChannel === `dm_${user.id}`
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${getStatusColor(user.status)} rounded-full border-2 border-white`}></div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className={`text-xs ${
                          activeChannel === `dm_${user.id}` ? 'text-purple-100' : 'text-gray-500'
                        }`}>
                          {user.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {user.unread > 0 && (
                        <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full min-w-6 text-center ${
                          activeChannel === `dm_${user.id}`
                            ? 'bg-white text-purple-600'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {user.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                Y
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(chatSettings.activeStatus)} rounded-full border-2 border-white`}></div>
            </div>
            <div>
              <div className="font-medium text-gray-800">You</div>
              <div className="text-xs text-gray-500 capitalize">{chatSettings.activeStatus}</div>
            </div>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;