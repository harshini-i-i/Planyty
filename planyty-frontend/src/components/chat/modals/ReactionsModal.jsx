import React from 'react';

const ReactionsModal = ({ 
  isOpen, // ADD THIS
  message, 
  onClose, 
  position, 
  onAddReaction 
}) => {
  const emojis = ['😀', '😍', '😂', '😮', '😢', '👍', '👎', '❤️', '🎉', '🔥'];

  if (!isOpen || !message) return null;

  return (
    <div
      className="fixed z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex items-center gap-1"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {emojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => {
            onAddReaction(message.id, emoji);
            onClose();
          }}
          className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 rounded-lg transition-transform hover:scale-125"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionsModal;