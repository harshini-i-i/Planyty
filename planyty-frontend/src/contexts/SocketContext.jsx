import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true); // always connected in mock mode

  // Store listeners like a real socket.io client
  const listeners = useRef({});

  // Mock socket object — behaves like real socket.io
  const socket = {
    on: (event, callback) => {
      listeners.current[event] = callback;
    },
    off: (event) => {
      delete listeners.current[event];
    },
    emit: (event, data) => {
      console.log("📤 Mock emit:", event, data);

      // Simulate backend behavior for message sending
      if (event === "sendMessage") {
        setTimeout(() => {
          const incoming = {
            sender: "MockUser",
            text: data.text,
            chatId: data.chatId,
            createdAt: new Date(),
          };

          // Trigger listener if exists
          if (listeners.current["chatMessage"]) {
            listeners.current["chatMessage"](incoming);
          }
        }, 800);
      }

      // Simulate typing event
      if (event === "typing") {
        if (listeners.current["typing"]) {
          listeners.current["typing"](data);
        }
      }
    },
  };

  useEffect(() => {
    console.log("🟢 Mock Socket Active — No backend needed.");
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
