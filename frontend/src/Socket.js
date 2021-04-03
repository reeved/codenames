import io from 'socket.io-client';

const socket = io('http://localhost:6001');

export default socket;
