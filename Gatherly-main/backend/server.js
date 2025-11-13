
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity in development
    methods: ["GET", "POST"]
  }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  let currentRoomId = null;

  socket.on('join-room', ({ roomId, userName }) => {
    currentRoomId = roomId;
    if (!rooms[roomId]) {
      rooms[roomId] = {};
    }

    // Get list of other users in the room
    const otherUsers = Object.keys(rooms[roomId]);
    
    // Add the new user
    rooms[roomId][socket.id] = { id: socket.id, name: userName };
    socket.join(roomId);

    console.log(`User ${userName} (${socket.id}) joined room ${roomId}`);

    // Send the list of existing users to the new user
    socket.emit('room-users', otherUsers.map(id => rooms[roomId][id]));

    // Notify other users that a new user has joined
    socket.to(roomId).emit('user-joined', { id: socket.id, name: userName });
  });

  socket.on('offer', (payload) => {
    const room = rooms[currentRoomId];
    if (room && room[socket.id]) {
      // Relay offer to the target user, now including the sender's name
      io.to(payload.target).emit('offer', {
        source: socket.id,
        sourceName: room[socket.id].name,
        sdp: payload.sdp,
      });
    }
  });

  socket.on('answer', (payload) => {
    // Relay answer to the target user
    io.to(payload.target).emit('answer', {
      source: socket.id,
      sdp: payload.sdp,
    });
  });

  socket.on('ice-candidate', (payload) => {
    // Relay ICE candidate to the target user
    io.to(payload.target).emit('ice-candidate', {
      source: socket.id,
      candidate: payload.candidate,
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    // Find the room the user was in and remove them
    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) {
        delete rooms[roomId][socket.id];
        // Notify remaining users
        io.to(roomId).emit('user-left', socket.id);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Signaling server listening on port ${PORT}`);
});
