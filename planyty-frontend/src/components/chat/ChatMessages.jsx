import React, { useEffect, useRef, useState } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Image as ImageIcon, FileText, Video, ChevronRight } from 'lucide-react';
import { FakeServer } from '../../fake-backend/fakeServer';
import TeamInfoModal from './modals/TeamInfoModal';
import MessageActionsModal from './modals/MessageActionsModal';
import ReactionsModal from './modals/ReactionsModal';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import ForwardModal from './modals/ForwardModal';

const ChatMessages = ({ 
  currentChat, 
  messages, 
  onSendMessage, 
  onDeleteMessage,
  onAddReaction,
  socketStatus,
  currentUser,
  teams = [],
  channels = []
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showTeamInfo, setShowTeamInfo] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [simulatedMessages, setSimulatedMessages] = useState([]);
  
  // Message action states
  const [messageActions, setMessageActions] = useState({
    isOpen: false,
    message: null,
    position: { x: 0, y: 0 },
    isCurrentUser: false,
  });
  const [reactionsModal, setReactionsModal] = useState({
    isOpen: false,
    message: null,
    position: { x: 0, y: 0 },
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    messageId: null,
    forEveryone: false,
  });
  const [forwardModal, setForwardModal] = useState({
    isOpen: false,
    message: null,
  });
  const [isReplying, setIsReplying] = useState(false);
  const [replyingMessage, setReplyingMessage] = useState(null);

  // Base chat info
  const baseChatInfo = {
    'general': { 
      name: 'general', 
      description: 'General workspace discussion', 
      type: 'channel', 
      members: 42 
    },
    'design': { 
      name: 'design', 
      description: 'Design team discussions', 
      type: 'channel', 
      members: 12 
    },
    'announcements': { 
      name: 'announcements', 
      description: 'Company announcements', 
      type: 'channel', 
      members: 50 
    },
    'frontend-team': { 
      name: 'Frontend Team', 
      description: 'Frontend development team', 
      type: 'team', 
      members: 8 
    },
    'backend-team': { 
      name: 'Backend Team', 
      description: 'Backend development team', 
      type: 'team', 
      members: 6 
    },
    'dm_john': { 
      name: 'John Doe', 
      description: 'Frontend Lead', 
      type: 'dm', 
      status: 'online' 
    },
  };

  const getChatInfo = () => {
    if (baseChatInfo[currentChat]) {
      return baseChatInfo[currentChat];
    }
    
    const team = teams.find(t => t.id === currentChat);
    if (team) {
      return {
        name: team.name,
        description: `${team.name} workspace`,
        type: 'team',
        members: Math.floor(Math.random() * 10) + 5
      };
    }
    
    const channel = channels.find(c => c.id === currentChat);
    if (channel) {
      return {
        name: channel.name,
        description: `${channel.name} channel`,
        type: 'channel',
        members: Math.floor(Math.random() * 30) + 10
      };
    }
    
    if (currentChat.startsWith('dm_')) {
      const name = currentChat.replace('dm_', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return {
        name,
        description: 'Direct message conversation',
        type: 'dm',
        status: 'online'
      };
    }
    
    if (currentChat.includes('team') || currentChat.includes('-team')) {
      const name = currentChat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return {
        name,
        description: `${currentChat.replace(/-/g, ' ')} workspace`,
        type: 'team',
        members: Math.floor(Math.random() * 10) + 5
      };
    }
    
    return {
      name: currentChat,
      description: `${currentChat} channel`,
      type: 'channel',
      members: Math.floor(Math.random() * 30) + 10
    };
  };

  const chatInfo = getChatInfo();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, simulatedMessages]);

  // Message simulation effect
  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    
    const simulateIncomingMessage = () => {
      if (!isMounted) return;
      
      const incoming = FakeServer.simulateIncomingMessage(currentChat);
      
      if (incoming && incoming.sender !== currentUser) {
        setSimulatedMessages(prev => {
          const exists = prev.some(msg => msg.id === incoming.id);
          if (exists) return prev;
          
          return [...prev, incoming];
        });
        
        FakeServer.addMessage(currentChat, incoming);
      }
    };
    
    timeoutId = setTimeout(() => {
      if (isMounted) {
        simulateIncomingMessage();
        
        const scheduleNextMessage = () => {
          if (!isMounted) return;
          
          const randomDelay = 8000 + Math.random() * 7000;
          timeoutId = setTimeout(() => {
            simulateIncomingMessage();
            scheduleNextMessage();
          }, randomDelay);
        };
        
        scheduleNextMessage();
      }
    }, 5000);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [currentChat, currentUser]);

  // ========== MESSAGE ACTION HANDLERS ==========
  const handleDoubleClick = (message, event, isCurrentUser) => {
    event.stopPropagation();
    setMessageActions({
      isOpen: true,
      message,
      position: { x: event.clientX, y: event.clientY },
      isCurrentUser,
    });
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessageActions({ ...messageActions, isOpen: false });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReply = (message) => {
    setReplyingMessage(message);
    setIsReplying(true);
    setMessageActions({ ...messageActions, isOpen: false });
    
    setTimeout(() => {
      const input = document.querySelector('textarea');
      if (input) {
        input.focus();
      }
    }, 100);
  };

  const handleForward = (message) => {
    setForwardModal({ isOpen: true, message });
    setMessageActions({ ...messageActions, isOpen: false });
  };

  const handleActualForward = (message, chatId) => {
    const forwardMessage = {
      ...message,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      forwarded: true,
      originalSender: message.sender,
      sender: 'You',
      text: `Forwarded: ${message.text}`
    };
    
    // Send to current chat to show it was forwarded
    onSendMessage(forwardMessage);
    FakeServer.addMessage(currentChat, forwardMessage);
    
    // Also add to the target chat
    FakeServer.addMessage(chatId, {
      ...forwardMessage,
      id: Date.now() + Math.random() + 1
    });
    
    setForwardModal({ ...forwardModal, isOpen: false });
  };

  const handleDelete = (messageId) => {
    setDeleteModal({ isOpen: true, messageId, forEveryone: false });
    setMessageActions({ ...messageActions, isOpen: false });
  };

  const handleDeleteForEveryone = (messageId) => {
    setDeleteModal({ isOpen: true, messageId, forEveryone: true });
    setMessageActions({ ...messageActions, isOpen: false });
  };

  const confirmDelete = () => {
    const { messageId, forEveryone } = deleteModal;
    onDeleteMessage(messageId, forEveryone);
    setDeleteModal({ isOpen: false, messageId: null, forEveryone: false });
  };

  const handleReact = (message) => {
    setReactionsModal({
      isOpen: true,
      message,
      position: { 
        x: messageActions.position.x, 
        y: messageActions.position.y - 50 
      },
    });
    setMessageActions({ ...messageActions, isOpen: false });
  };

  const handleAddReaction = (messageId, emoji) => {
    onAddReaction(messageId, emoji);
    setReactionsModal({ ...reactionsModal, isOpen: false });
  };

  const handleEdit = (message) => {
    console.log('Edit message:', message);
    setMessageActions({ ...messageActions, isOpen: false });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
      sender: currentUser,
      replyTo: replyingMessage ? {
        id: replyingMessage.id,
        sender: replyingMessage.sender,
        text: replyingMessage.text
      } : null
    };

    onSendMessage(msg);
    FakeServer.addMessage(currentChat, msg);
    setNewMessage('');
    setReplyingMessage(null);
    setIsReplying(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const msg = {
        text: `Uploaded file: ${file.name}`,
        file,
        timestamp: new Date().toISOString(),
        type: 'file',
        sender: currentUser,
        replyTo: replyingMessage ? {
          id: replyingMessage.id,
          sender: replyingMessage.sender,
          text: replyingMessage.text
        } : null
      };

      onSendMessage(msg);
      FakeServer.addMessage(currentChat, msg);
      e.target.value = '';
      setReplyingMessage(null);
      setIsReplying(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) {
      return <ImageIcon className="w-4 h-4" />;
    } else if (['mp4', 'mov', 'avi'].includes(ext)) {
      return <Video className="w-4 h-4" />;
    } else {
      return <FileText className="w-4 h-4" />;
    }
  };

  const allMessages = [...(messages || []), ...simulatedMessages]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const groupMessagesByDate = () => {
    const groups = {};
    allMessages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();
  const isTeamChat = chatInfo.type === 'team';

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside all modals
      const isOutsideMessageActions = !event.target.closest('.message-actions-modal');
      const isOutsideReactions = !event.target.closest('.reactions-modal');
      
      if (messageActions.isOpen && isOutsideMessageActions) {
        setMessageActions({ ...messageActions, isOpen: false });
      }
      if (reactionsModal.isOpen && isOutsideReactions) {
        setReactionsModal({ ...reactionsModal, isOpen: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [messageActions, reactionsModal]);

  // Message Bubble Component
  const MessageBubble = ({ message, isCurrentUser, showAvatar, showTimestamp }) => {
    const hasReactions = message.reactions && Object.keys(message.reactions).length > 0;
    
    return (
      <div className={`relative ${isCurrentUser ? 'order-1' : 'order-2'}`}>
        {/* Message bubble */}
        <div className={`px-4 py-3 rounded-2xl relative ${
          isCurrentUser
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
        }`}>
          {/* Reply indicator */}
          {message.replyTo && (
            <div className="mb-2 pb-2 border-l-4 border-purple-400 pl-2">
              <div className="text-xs opacity-90">
                Replying to <span className="font-medium">{message.replyTo.sender}</span>
              </div>
              <div className="text-sm truncate opacity-80">
                {message.replyTo.text.length > 50 
                  ? `${message.replyTo.text.substring(0, 50)}...` 
                  : message.replyTo.text}
              </div>
            </div>
          )}
          
          {/* Reactions */}
          {hasReactions && (
            <div className="mb-2 flex flex-wrap gap-1">
              {Object.entries(message.reactions).map(([emoji, users]) => (
                <div
                  key={emoji}
                  className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 cursor-pointer ${
                    users.includes(currentUser)
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddReaction(message.id, emoji);
                  }}
                >
                  {emoji} {users.length > 1 ? users.length : ''}
                </div>
              ))}
            </div>
          )}
          
          {message.type === 'file' ? (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {getFileIcon(message.file?.name || 'file')}
              </div>
              <div>
                <div className="font-medium">{message.file?.name || 'File'}</div>
                <div className="text-xs opacity-80">{message.text}</div>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words">{message.text}</div>
          )}
          
          {showTimestamp && (
            <div className={`text-xs mt-1.5 flex items-center justify-end gap-1 ${
              isCurrentUser ? 'text-purple-100' : 'text-gray-500'
            }`}>
              {formatTime(message.timestamp)}
              {isCurrentUser && message.read && (
                <span className="text-blue-400">✓✓</span>
              )}
            </div>
          )}
        </div>
        
        {/* Three-dot action button - REMOVED as per your request */}
        {/* No three-dot button, only double-click */}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-white h-full">
      {/* Chat Header */}
      <div 
        className={`p-4 border-b border-gray-200 bg-white ${isTeamChat ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
        onClick={() => {
          if (isTeamChat) {
            setShowTeamInfo(true);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
              {chatInfo.name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-800">
                  {chatInfo.type === 'dm' ? chatInfo.name : `#${chatInfo.name}`}
                </h2>
                {isTeamChat && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {chatInfo.type === 'dm' 
                  ? `${chatInfo.description} • ${chatInfo.status}`
                  : `${chatInfo.description} • ${chatInfo.members} members`
                }
                {isTeamChat && (
                  <span className="ml-2 text-purple-600 font-medium">• Click for team info</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              socketStatus === 'connected' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {socketStatus === 'connected' ? '● Live' : '○ Offline'}
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex items-center justify-center my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="px-3 py-1 mx-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {date}
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="space-y-4">
              {dateMessages.map((message, index) => {
                const isCurrentUser = message.sender === currentUser;
                const showAvatar = index === 0 || dateMessages[index - 1].sender !== message.sender;
                const showTimestamp = index === dateMessages.length - 1 || dateMessages[index + 1].sender !== message.sender;

                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    onDoubleClick={(e) => handleDoubleClick(message, e, isCurrentUser)}
                  >
                    <div className={`max-w-xl ${isCurrentUser ? 'ml-auto' : ''}`}>
                      {!isCurrentUser && showAvatar && (
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-medium">
                            {message.sender.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{message.sender}</span>
                        </div>
                      )}
                      
                      <div className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                        {!isCurrentUser && showAvatar ? <div className="w-6"></div> : null}
                        
                        <MessageBubble 
                          message={message}
                          isCurrentUser={isCurrentUser}
                          showAvatar={showAvatar}
                          showTimestamp={showTimestamp}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Indicator */}
      {isReplying && replyingMessage && (
        <div className="px-4 py-2 bg-purple-50 border-t border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs">
              <ReplyIcon className="w-3 h-3" />
            </div>
            <div>
              <div className="text-xs text-purple-700 font-medium">
                Replying to {replyingMessage.sender}
              </div>
              <div className="text-xs text-purple-600 truncate max-w-md">
                {replyingMessage.text.length > 100 
                  ? `${replyingMessage.text.substring(0, 100)}...` 
                  : replyingMessage.text}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setIsReplying(false);
              setReplyingMessage(null);
            }}
            className="p-1 hover:bg-purple-100 rounded"
          >
            <X className="w-4 h-4 text-purple-600" />
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSend} className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${chatInfo.type === 'dm' ? chatInfo.name : '#' + chatInfo.name}`}
                className="w-full h-full min-h-[44px] max-h-32 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows="1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              
              <button
                type="button"
                onClick={() => {}}
                className="absolute right-12 bottom-2 p-1.5 hover:bg-gray-200 rounded"
                title="Add emoji"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Modals - Using external files */}
      <MessageActionsModal
        isOpen={messageActions.isOpen}
        message={messageActions.message}
        isCurrentUser={messageActions.isCurrentUser}
        position={messageActions.position}
        onClose={() => setMessageActions({ ...messageActions, isOpen: false })}
        onCopy={handleCopy}
        onReply={handleReply}
        onForward={handleForward}
        onDelete={handleDelete}
        onDeleteForEveryone={handleDeleteForEveryone}
        onReact={handleReact}
        onEdit={handleEdit}
      />

      <ReactionsModal
        isOpen={reactionsModal.isOpen}
        message={reactionsModal.message}
        position={reactionsModal.position}
        onClose={() => setReactionsModal({ ...reactionsModal, isOpen: false })}
        onAddReaction={handleAddReaction}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        isDeleteForEveryone={deleteModal.forEveryone}
      />

      <ForwardModal
        isOpen={forwardModal.isOpen}
        onClose={() => setForwardModal({ ...forwardModal, isOpen: false })}
        message={forwardModal.message}
        channels={channels}
        teams={teams}
        onForward={handleActualForward}
      />

      {/* Team Info Modal */}
      {showTeamInfo && (
        <TeamInfoModal
          team={{ 
            id: currentChat, 
            name: chatInfo.name,
            description: chatInfo.description 
          }}
          onClose={() => setShowTeamInfo(false)}
          onLeaveTeam={() => {
            console.log('Leave team clicked');
            setShowTeamInfo(false);
          }}
          onDeleteTeam={() => {
            console.log('Delete team clicked');
            setShowTeamInfo(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatMessages;