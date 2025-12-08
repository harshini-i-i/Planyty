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
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.closest('[data-reaction-modal]')
      ) {
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
    { icon: Copy, label: 'Copy Text', onClick: (_, msg) => onCopy && onCopy(msg.text) },
    { icon: Reply, label: 'Reply', onClick: (_, msg) => onReply && onReply(msg) },
    { icon: Forward, label: 'Forward', onClick: (_, msg) => onForward && onForward(msg) },
    // FIXED: Changed to pass only the message, not the event
    { 
      icon: Smile, 
      label: 'React', 
      onClick: (e, msg) => {
        e.preventDefault();
        e.stopPropagation();
        console.debug('MessageActionsModal: React clicked', msg);
        // Pass only the message, not the event
        onReact && onReact(msg);
      } 
    },
  ];

  const userSpecificActions = isCurrentUser ? [
    { icon: MoreVertical, label: 'Edit', onClick: (_, msg) => onEdit && onEdit(msg) },
    { icon: Trash2, label: 'Delete for me', onClick: (_, msg) => onDelete && onDelete(msg.id) },
    { icon: Trash2, label: 'Delete for everyone', onClick: (_, msg) => onDeleteForEveryone && onDeleteForEveryone(msg.id), danger: true },
  ] : [];

  return (
    <div
      ref={modalRef}
      className="message-actions-modal fixed z-50 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {actions.map((action, index) => (
        <button
          key={index}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            action.onClick && action.onClick(e, message);
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
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick && action.onClick(e, message);
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