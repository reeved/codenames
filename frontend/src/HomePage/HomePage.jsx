import { React, useState } from 'react';
import styles from './HomePage.module.css';
import { Grid, TextField, Button, makeStyles } from '@material-ui/core';
import socket from '../Socket';

const useStyles = makeStyles({
  textField: {
    width: '80%',
  },
  input: {
    fontSize: 'calc(10px + 1.4vmin)',
    backgroundColor: `hsl(34, 57%, 70%)`,
  },
  button: {
    width: '100%',
    padding: '1em 0 1em 0',
    fontSize: 'calc(10px + 1vmin)',
    marginTop: '2em',
    backgroundColor: ({ lobbyCode }) => (lobbyCode ? 'Teal' : 'Coral'),
    '&:hover': {
      backgroundColor: ({ lobbyCode }) => (lobbyCode ? 'CadetBlue' : 'DarkSalmon'),
    },
  },
});

const HomePage = () => {
  const [nickname, setNickname] = useState('');
  const [lobbyCode, setCode] = useState('');
  const [nicknameError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(' ');

  const classes = useStyles({ lobbyCode });

  const handleBtnClick = () => {
    if (lobbyCode) {
      console.log('Joining a game');
      socket.emit('join-lobby', nickname);
    } else {
      console.log('Creating a game');
      socket.emit('create-lobby', nickname);
    }
  };

  const validateNickname = (text) => {
    if (/\s/.test(text)) {
      setError(true);
      setErrorMsg('Nicknames cannot have spaces.');
    } else {
      setError(false);
      setErrorMsg(' ');
      setNickname(text);
    }
  };

  return (
    <div className={styles.container}>
      <h1>LOCKDOWN GAMES</h1>
      <Grid container spacing={3} justify="center">
        <Grid container item xs={12} md={4} lg={4} justify="flex-end" alignItems="center" style={{ marginBottom: '1.25rem' }}>
          <p>Nickname</p>
        </Grid>
        <Grid container item xs={12} md={8} lg={8} justify="flex-start">
          <TextField
            error={nicknameError}
            helperText={errorMsg}
            className={classes.textField}
            InputProps={{
              className: `${classes.input}`,
            }}
            inputProps={{ maxLength: 10 }}
            variant="outlined"
            onChange={(e) => validateNickname(e.target.value)}
          />
        </Grid>
        <Grid container item xs={12} md={4} lg={4} justify="flex-end" alignItems="center">
          <p>Lobby Code</p>
        </Grid>
        <Grid container item xs={12} md={8} lg={8} justify="flex-start">
          <TextField
            className={classes.textField}
            InputProps={{
              className: classes.input,
            }}
            inputProps={{ maxLength: 6 }}
            variant="outlined"
            onChange={(e) => setCode(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Button className={`${classes.button}`} variant="contained" disabled={!nickname || nicknameError} onClick={handleBtnClick}>
            {lobbyCode ? `Join Lobby` : `Create Lobby`}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
