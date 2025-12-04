// src/pages/Chat.jsx
import React from 'react';
import Chat from '../components/chat';

const ChatPage = () => {
  return (
    <div className="h-[calc(100vh-80px)] p-4 bg-gradient-to-br from-[#EED5F0] via-white to-[#A067A3]">
      <div className="h-full">
        <Chat />
      </div>
    </div>
  );
};

export default ChatPage;