const Lobby = require('../Domain/Lobby');
const LobbyManager = require('../Domain/LobbyManager');
const Player = require('../Domain/Player');

function createLobby(io, socket, lobbyManager) {
  socket.on('create-lobby', (nickname) => {
    const lobby = lobbyManager.createLobby();
    const host = new Player(nickname, socket.id, lobby.roomID, true);
    lobby.addPlayer(host);
    lobby.host = host;
    socket.join(lobby.roomID);
    socket.player = host;

    //console.log(lobbyManager.lobbies);
    socket.emit('join-lobby', lobby.roomID, nickname);
    io.in(lobby.roomID).emit('update-players', lobby.getPlayerNicknames());
  });
}

function joinLobby(io, socket, lobbyManager) {
  socket.on('join-lobby', (nickname, lobbyCode) => {
    const lobby = lobbyManager.lobbies.get(lobbyCode);

    if (!lobby) {
      console.log('Invalid Lobby Code: ', lobbyCode);
      socket.emit('join-lobby', null, 'Anon');
      return;
    }

    const player = new Player(nickname, socket.id, lobby.roomID, false);
    lobby.addPlayer(player);
    socket.join(lobby.roomID);
    socket.player = player;

    socket.emit('join-lobby', lobby.roomID, nickname);
    io.in(lobby.roomID).emit('update-players', lobby.getPlayerNicknames());
  });
}

function chatMessage(io, socket, lobbyManager) {
  socket.on('chat message', ({ msg, playerNickname }) => {
    console.log(msg);
    message = playerNickname + ': ' + msg;
    io.emit('chat message', message);
  });
}

function setNickname(io, socket, lobbyManager) {
  //   socket.on('join-lobby', (nickname, lobbyCode) => {
  //     console.log(`Player ${nickname} joined with code ${lobbyCode}`);
  //     socket.emit('set-nickname', nickname);
  //   });
}

module.exports = function (io, socket, lobbyManager) {
  createLobby(io, socket, lobbyManager);
  joinLobby(io, socket, lobbyManager);
  chatMessage(io, socket, lobbyManager);
  setNickname(io, socket, lobbyManager);
};
