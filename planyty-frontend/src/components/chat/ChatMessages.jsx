import React, { useEffect, useRef, useState } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Image as ImageIcon, FileText, Video } from 'lucide-react';

const ChatMessages = ({ 
  currentChat, 
  messages, 
  onSendMessage, 
  socketStatus,
  currentUser
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock data for current chat info
  const chatInfo = {
    'general': { name: 'general', description: 'General workspace discussion', type: 'channel', members: 42 },
    'design': { name: 'design', description: 'Design team discussions', type: 'channel', members: 12 },
    'frontend-team': { name: 'Frontend Team', description: 'Frontend development team', type: 'team', members: 8 },
    'dm_john': { name: 'John Doe', description: 'Frontend Lead', type: 'dm', status: 'online' },
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    onSendMessage({
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    });
    
    setNewMessage('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSendMessage({
        text: `Uploaded file: ${file.name}`,
        file,
        timestamp: new Date().toISOString(),
        type: 'file'
      });
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

  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-white h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
              {chatInfo[currentChat]?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {chatInfo[currentChat]?.type === 'dm' ? chatInfo[currentChat]?.name : `#${chatInfo[currentChat]?.name}`}
              </h2>
              <p className="text-sm text-gray-500">
                {chatInfo[currentChat]?.type === 'dm' 
                  ? `${chatInfo[currentChat]?.description} • ${chatInfo[currentChat]?.status}`
                  : `${chatInfo[currentChat]?.description} • ${chatInfo[currentChat]?.members} members`
                }
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
            {/* Date Separator */}
            <div className="flex items-center justify-center my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="px-3 py-1 mx-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {date}
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-4">
              {dateMessages.map((message, index) => {
                const isCurrentUser = message.sender === 'You';
                const showAvatar = index === 0 || dateMessages[index - 1].sender !== message.sender;
                const showTimestamp = index === dateMessages.length - 1 || dateMessages[index + 1].sender !== message.sender;

                return (
                  <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
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
                        {!isCurrentUser && showAvatar ? (
                          <div className="w-6"></div> // Spacer for alignment
                        ) : isCurrentUser ? null : (
                          <div className="invisible w-6"></div> // Hidden spacer
                        )}
                        
                        <div className={`relative group ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                          <div className={`px-4 py-3 rounded-2xl ${
                            isCurrentUser
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
                              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                          }`}>
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
                          
                          <button className={`absolute top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/20 rounded ${
                            isCurrentUser ? '-left-8' : '-right-8'
                          }`}>
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
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

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSend} className="space-y-3">
          {/* Attachment Preview */}
          {fileInputRef.current?.files?.[0] && (
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-purple-700">
                {fileInputRef.current.files[0].name}
              </span>
              <button 
                type="button"
                onClick={() => fileInputRef.current.value = ''}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          )}
          
          <div className="flex gap-2">
            {/* Attachment Button */}
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
            
            {/* Message Input */}
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${chatInfo[currentChat]?.type === 'dm' ? chatInfo[currentChat]?.name : '#' + chatInfo[currentChat]?.name}`}
                className="w-full h-full min-h-[44px] max-h-32 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows="1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              
              {/* Emoji Button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-12 bottom-2 p-1.5 hover:bg-gray-200 rounded"
                title="Add emoji"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <div className="flex items-center gap-2 ml-auto">
              <button type="button" className="hover:text-purple-600">Format</button>
              <button type="button" className="hover:text-purple-600">Schedule</button>
              <button type="button" className="hover:text-purple-600">Save draft</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatMessages;