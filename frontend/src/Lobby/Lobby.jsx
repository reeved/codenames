import { React, useState, useContext } from 'react';
import styles from './Lobby.module.css';
import socket from '../Socket';
import { CodenamesContext } from '../Context';
import { Grid, TextField, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  textField: {
    width: '80%',
  },
  input: {
    fontSize: 'calc(10px + 1vmin)',
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    fontSize: 'calc(10px + 1vmin)',
    backgroundColor: 'tan',
    '&:hover': {
      backgroundColor: 'navajowhite',
    },
  },
});

const Lobby = () => {
  const { state: gameState } = useContext(CodenamesContext);
  const classes = useStyles();
  const [chosenGame, setGame] = useState('Codenames');
  const [msg, setMsg] = useState('');

  const games = ['Codenames', 'Poker', 'Tahi', 'Scum'];

  const players = ['Reeve', 'Jack', 'Steven', 'Daniel', 'Callum', 'Ben'];

  const sendChatMessage = () => {
    socket.emit('chat message', msg);
  };

  return (
    <div className={styles.container}>
      <h1>LOBBY</h1>
      <div className={styles.gameContainer}>
        <h2 className={styles.subheader}>Select Game</h2>
        <div className={styles.gamesList}>
          {games.map((game, index) => {
            return (
              <p key={index} className={`${styles.game} ${chosenGame === game && styles.activeGame}`} onClick={() => setGame(game)}>
                {game}
              </p>
            );
          })}
        </div>
      </div>
      <Grid container spacing={5}>
        <Grid container item lg={4} alignItems="stretch">
          <div className={`${styles.moreInfo} ${styles.aboutGame}`}>
            <h2 className={styles.subheader}>About Game</h2>
          </div>
        </Grid>
        <Grid container item lg={4} alignItems="stretch">
          <div className={`${styles.moreInfo} ${styles.lobbyPlayers}`}>
            <h2 className={styles.subheader}>Players in Lobby</h2>
            {players.map((player, index) => {
              return (
                <p className={styles.playerList} key={index}>
                  {player}
                </p>
              );
            })}
          </div>
        </Grid>
        <Grid container item lg={4} alignItems="stretch">
          <div className={`${styles.moreInfo} ${styles.chat}`}>
            <h2 className={styles.subheader}>Chat</h2>
            <div className={styles.chatBox}>
              {gameState.chatMessages.map((msg, index) => {
                return (
                  <p className={styles.chatMessages} key={index}>
                    {msg}
                  </p>
                );
              })}
            </div>
            <div className={styles.chatInputs}>
              <TextField
                variant="outlined"
                style={{ width: '70%' }}
                className={classes.textField}
                InputProps={{
                  className: `${classes.input}`,
                }}
                onChange={(e) => setMsg(e.target.value)}
              ></TextField>
              <Button variant="contained" style={{ width: '25%' }} className={classes.button} onClick={() => sendChatMessage()}>
                Submit
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Lobby;
