const words = require('../ServerResources/wordlist.js');
const Lobby = require('../Domain/Lobby');

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

function newGame(io, socket) {
  socket.on('new-game', () => {
    const roomID = socket.player.lobbyID;
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

    io.in(roomID).emit('new-codenames', boardWords);
  });
}

function updateSelected(io, socket) {
  socket.on('update-selected', (id) => {
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('update-selected', id);
  });
}

function decrementScore(io, socket) {
  socket.on('decrement-score', (team) => {
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('decrement-score', team);
  });
}

function changeTurn(io, socket) {
  socket.on('change-turn', (currentTeam) => {
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('change-turn', currentTeam === 'Red' ? 'Blue' : 'Red');
  });
}

function setGameOver(io, socket) {
  socket.on('game-over', () => {
    const roomID = socket.player.lobbyID;
    io.in(roomID).emit('game-over');
  });
}

module.exports = function (io, socket) {
  newGame(io, socket);
  decrementScore(io, socket);
  setGameOver(io, socket);
  updateSelected(io, socket);
  changeTurn(io, socket);
};
