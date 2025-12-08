import React, { useState, useEffect } from 'react';

const ReactionsModal = ({ 
  isOpen,
  message, 
  onClose, 
  position, 
  onAddReaction 
}) => {
  const emojis = ['😀', '😍', '😂', '😮', '😢', '👍', '👎', '❤️', '🎉', '🔥'];

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // auto-hide toast
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => {
      setShowToast(false);
      setSelectedEmoji(null);
    }, 1800);
    return () => clearTimeout(t);
  }, [showToast]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.reactions-modal')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !message || !message.id) {
    console.log('ReactionsModal not rendering:', { isOpen, message });
    return null;
  }

  const handleEmojiClick = (emoji) => {
    console.log('Emoji clicked:', emoji, 'for message:', message.id);
    setSelectedEmoji(emoji);
    setShowToast(true);
    
    if (onAddReaction && message && message.id) {
      onAddReaction(message.id, emoji);
    } else {
      console.error('Cannot add reaction: onAddReaction, message, or message.id is missing');
    }
    
    onClose();
  };

  return (
    <>
      <div
        className="fixed z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex items-center gap-1 reactions-modal"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleEmojiClick(emoji)}
            className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 rounded-lg transition-transform hover:scale-125"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Floating confirmation toast at bottom-right */}
      {showToast && selectedEmoji && (
        <div className="fixed bottom-4 right-4 z-60 pointer-events-none">
          <div className="bg-white rounded-full p-3 shadow-xl flex items-center justify-center text-2xl transform transition-all duration-300">
            {selectedEmoji}
          </div>
        </div>
      )}
    </>
  );
};

export default ReactionsModal;