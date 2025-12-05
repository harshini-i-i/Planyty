import React, { useState, useRef, useEffect } from 'react';
import { Copy, Reply, Forward, Trash2, Smile, MoreVertical } from 'lucide-react';

const MessageActionsModal = ({ 
  isOpen,
  message, 
  isCurrentUser, 
  onClose, 
  position,
  onCopy,
  onReply,
  onForward,
  onDelete,
  onDeleteForEveryone,
  onReact,
  onEdit
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !message) return null;

  const actions = [
    { icon: Copy, label: 'Copy Text', onClick: () => onCopy(message.text) },
    { icon: Reply, label: 'Reply', onClick: () => onReply(message) },
    { icon: Forward, label: 'Forward', onClick: () => onForward(message) },
    { icon: Smile, label: 'React', onClick: () => onReact(message) },
  ];

  const userSpecificActions = isCurrentUser ? [
    { icon: MoreVertical, label: 'Edit', onClick: () => onEdit(message) },
    { icon: Trash2, label: 'Delete for me', onClick: () => onDelete(message.id) },
    { icon: Trash2, label: 'Delete for everyone', onClick: () => onDeleteForEveryone(message.id), danger: true },
  ] : [];

  return (
    <div
      ref={modalRef}
      className="fixed z-50 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            action.onClick();
          }}
          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 text-gray-700 text-sm"
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </button>
      ))}
      
      {userSpecificActions.length > 0 && (
        <>
          <div className="h-px bg-gray-200 my-1" />
          {userSpecificActions.map((action, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 text-sm ${
                action.danger ? 'text-red-600 hover:text-red-700' : 'text-gray-700'
              }`}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default MessageActionsModal;