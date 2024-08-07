import { Server } from 'socket.io'
import http from 'http';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000']
  }
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('Um usuário conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
  socket.on('teste', (msg) => {
    console.log('botao clicado:', msg);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});