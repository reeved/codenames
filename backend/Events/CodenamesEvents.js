const words = require('../ServerResources/wordlist.js');

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function newGame(io) {
  console.log('A new game is starting.');
  const numWords = 24;

  var shuffledWords = shuffle(words);
  var boardWords = shuffledWords.slice(0, numWords);

  for (var i = 0; i < 24; i++) {
    if (i === 23) {
      boardWords[i]['status'] = 'bomb';
    } else if (i > 15) {
      boardWords[i]['status'] = 'unsafe';
    } else if (i > 7) {
      boardWords[i]['status'] = 'Red';
    } else {
      boardWords[i]['status'] = 'Blue';
    }
  }

  boardWords = shuffle(boardWords);

  io.emit('new-codenames', boardWords);
}

function createLobby(io, socket) {
  io.once('connection', () => {
    console.log('A new user has connected.');
    newGame(io);
    // Create room and assign host player to the room
    // Subscribe to the room events
    //socket.join();
    // Add player information to the host socket
    // Send room ID back to host.
    //io.in(roomID).emit('lobby-code', new LobbyCodeDTO(roomID));
  });
}

function resetBoard(io, socket) {
  socket.on('reset-game', () => {
    newGame(io);
  });
}

function updateSelected(io, socket) {
  socket.on('update-selected', (id) => {
    io.emit('update-selected', id);
  });
}

function decrementScore(io, socket) {
  socket.on('decrement-score', (team) => {
    io.emit('decrement-score', team);
  });
}

function changeTurn(io, socket) {
  socket.on('change-turn', (currentTeam) => {
    io.emit('change-turn', currentTeam === 'Red' ? 'Blue' : 'Red');
  });
}

function setGameOver(io, socket) {
  socket.on('game-over', () => {
    io.emit('game-over');
  });
}

function chatMessage(io, socket) {
  socket.on('chat message', (msg) => {
    console.log(msg);
    io.emit('chat message', msg);
  });
}

module.exports = function (io, socket) {
  createLobby(io, socket);
  chatMessage(io, socket);
  resetBoard(io, socket);
  decrementScore(io, socket);
  setGameOver(io, socket);
  updateSelected(io, socket);
  changeTurn(io, socket);
};
