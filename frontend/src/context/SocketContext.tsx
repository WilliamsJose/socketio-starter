import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    
    newSocket.on("connect", () => {
      console.log('Socket conectado.');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): Socket => {
  return useContext(SocketContext);
};