import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a socket context (no backend, just mock)
const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  // Fake socket state — no real backend
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(true); // pretend always connected

  useEffect(() => {
    console.log("🟢 Mock Socket Active — Frontend-only mode (no backend).");
    // No real connection needed
  }, []);

  const value = {
    socket,
    isConnected,
    emit: () => console.log("Mock emit called."),
    on: () => console.log("Mock on listener attached."),
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
