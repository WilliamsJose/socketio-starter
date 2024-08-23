import { Server } from 'socket.io'
import http from 'http';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000']
  }
});

const PORT = process.env.PORT || 3000;

interface IParticipant {
  id: string
  name: string
  socketId: string
}

interface IMessage {
  senderId: string;
  content: string;
  timestamp: Date;
}

interface IChatRoom {
  id: string
  ownerId: string
  participants: IParticipant[];
  messages: IMessage[];
}

const chatRooms: { [key: string]: IChatRoom } = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Evento para criar uma sala de chat
  socket.on('createRoom', (ownerId: string, name: string) => {
    const roomId = `room_${Date.now()}`; // Gera um ID único para a sala
    const participant = { id: ownerId, name, socketId: socket.id }
    chatRooms[roomId] = {
      id: roomId,
      ownerId,
      participants: [participant],
      messages: []
    };
    
    socket.join(roomId); // O dono entra na sala
    io.to(roomId).emit('roomCreated', roomId);
    console.log(`Room created: ${roomId} by ${ownerId}`);
  });
  
  // Evento para entrar em uma sala
  socket.on('joinRoom', (roomId: string, participantName: string, participantId: string) => {
    const room = chatRooms[roomId];
    if (room) {
      const participant: IParticipant = {
        id: participantId,
        name: participantName,
        socketId: socket.id
      };
      room.participants.push(participant);
      socket.join(roomId);
      io.to(roomId).emit('participantJoined', participantId, roomId); // Notifica os outros participantes
      console.log(`${participantName} entered the room: ${roomId}`);
    } else {
      console.log(`Room ${roomId} not found.`);
    }
  });

  // Evento para enviar uma mensagem
  socket.on('sendMessage', (roomId: string, messageContent: string, senderId: string) => {
    const room = chatRooms[roomId];
    if (room) {
      const message: IMessage = {
        senderId,
        content: messageContent,
        timestamp: new Date()
      };
      room.messages.push(message); // Adiciona a mensagem à sala

      // Ordena mensagens por timestamp
      room.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      const messagesString = JSON.stringify(room.messages)
      io.to(roomId).emit('newMessage', messagesString); // Envia a mensagem para todos na sala

      // Pseudo código para salvar a mensagem em um banco de dados
      /*
      saveMessageToDatabase({
        roomId: room.id,
        senderId: message.senderId,
        content: message.content,
        timestamp: message.timestamp
      });
      */
    } else {
      console.log(`Room ${roomId} not found.`);
    }
  });

  // Função auxiliar para remover um participante
  const removeParticipant = (roomId: string, participantId: string) => {
    const room = chatRooms[roomId];
    if (room) {
      room.participants = room.participants.filter(participant => participant.id !== participantId);
      io.to(roomId).emit('participantLeft', participantId); // Notifica os outros participantes
      console.log(`User ${participantId} left the room: ${roomId}`);
    }
  };

  // Evento para sair da sala
  socket.on('leaveRoom', (roomId: string, participantId: string) => {
    removeParticipant(roomId, participantId)
    socket.leave(roomId);
  });

  socket.on('disconnect', () => {
    Object.keys(chatRooms).forEach(roomId => {
      const room = chatRooms[roomId];
      const participant = room.participants.find(participant => participant.socketId === socket.id);
      if (participant) {
        removeParticipant(roomId, participant.id);
        socket.leave(roomId)
      }
    })
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});