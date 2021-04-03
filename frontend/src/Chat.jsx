import { useState, React, useContext } from 'react';
import socket from './Socket';
import { CodenamesContext } from './Context';
import Styles from './Chat.module.css';
import { TextField, Button } from '@material-ui/core';

const msgs = ['Hello', 'One', 'Two', 'Three', 'Four', 'Five', 'Five', 'Five'];

const Chat = () => {
  const { state } = useContext(CodenamesContext);
  const [msg, setMsg] = useState('');
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('chat message', msg);
  };

  const teamWord = state.team;

  return (
    <div className={Styles.container}>
      <>
        <h1>Chat</h1>
        <div className={Styles.messagesContainer}>
          {msgs.map((text, index) => {
            return <p key={index}>Helo{text}</p>;
          })}
        </div>
      </>
      <div className={Styles.inputContainer}>
        <TextField
          id='input'
          autoComplete='off'
          variant='outlined'
          multiline={true}
          rows='2'
          rowsMax='2'
          inputProps={{ style: { fontSize: '1.2rem' } }}
          onChange={(e) => setMsg(e.target.value)}
        />
        <Button variant='contained' onClick={(e) => sendMessage(e)}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
