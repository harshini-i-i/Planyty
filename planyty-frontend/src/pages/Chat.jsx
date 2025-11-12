import React, { useState, useEffect, useRef } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Send, Users, MessageSquare } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

const initialMessages = [
  { id: 1, user: 'System', text: 'Welcome to the project chat! Say hello to your team.', type: 'system' },
  { id: 2, user: 'John Doe', text: 'Hey everyone, ready for the sprint planning meeting?', type: 'incoming' },
  { id: 3, user: 'You', text: 'Almost! Just finishing up the task board setup.', type: 'outgoing' },
];

const Chat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const { socket, isConnected } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, { ...message, type: 'incoming' }]);
    };

    socket.on('chatMessage', handleNewMessage);

    return () => {
      socket.off('chatMessage', handleNewMessage);
    };
  }, [socket]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      user: 'You',
      text: input.trim(),
      type: 'outgoing',
    };

    // Simulate sending to server
    if (socket && isConnected) {
      socket.emit('sendMessage', { text: input.trim(), user: 'You' });
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
  };

  const MessageBubble = ({ message }) => {
    const isOutgoing = message.type === 'outgoing';
    const isSystem = message.type === 'system';

    if (isSystem) {
      return (
        <div className="text-center text-sm text-gray-500 my-2">
          --- {message.text} ---
        </div>
      );
    }

    return (
      <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-md ${
            isOutgoing
              ? 'bg-dark text-white rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none'
          }`}
        >
          {!isOutgoing && <p className="text-xs font-semibold mb-1 text-accent">{message.user}</p>}
          <p>{message.text}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Sidebar for Users/Channels */}
      <div className="w-64 bg-secondary border-r p-4 hidden md:block">
        <h2 className="text-xl font-bold text-dark mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Channels
        </h2>
        <ul className="space-y-2">
          <li className="p-2 bg-accent rounded-lg font-medium text-dark cursor-pointer"># general</li>
          <li className="p-2 hover:bg-accent/50 rounded-lg cursor-pointer"># design-feedback</li>
          <li className="p-2 hover:bg-accent/50 rounded-lg cursor-pointer"># development</li>
        </ul>
        <h2 className="text-xl font-bold text-dark mt-6 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Users
        </h2>
        <ul className="space-y-2">
          <li className="p-2 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            You (Online)
          </li>
          <li className="p-2 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            John Doe
          </li>
          <li className="p-2 flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            Jane Smith
          </li>
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-primary">
        <div className="p-4 border-b bg-white shadow-sm">
          <h2 className="text-xl font-bold text-gray-900"># general</h2>
          <p className="text-sm text-gray-500">General discussion about the project.</p>
          <p className="text-xs text-gray-500 mt-1">
            Socket Status: {isConnected ? <span className="text-green-500">Connected</span> : <span className="text-red-500">Disconnected</span>}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" variant="primary" disabled={!isConnected}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
