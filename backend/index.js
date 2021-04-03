const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 6001;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*', // Allow all origin to connect to the website
  },
});

const loadCodenamesEvents = require('./Events/CodenamesEvents');

app.get('/', (req, res) => {
  res.send('The server is running');
});

io.on('connection', (socket) => {
  loadCodenamesEvents(io, socket);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  //loadCodenamesEvents(io, socket);
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
