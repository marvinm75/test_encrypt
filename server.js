const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Join a room
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    console.log(`${username} joined room: ${room}`);
    
    // Welcome current user
    socket.emit('message', 'Welcome to the chat!');
    
    // Broadcast when a user connects
    socket.broadcast.to(room).emit('message', `${username} has joined the chat`);
  });

  // Listen for chatMessage
  socket.on('chatMessage', ({ message, room }) => {
    io.to(room).emit('message', message);
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
