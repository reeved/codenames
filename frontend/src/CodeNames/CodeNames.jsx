import { useContext, React } from 'react';
import { Redirect, Link } from 'react-router-dom';
import styles from './WordBoard.module.css';
import { CodenamesContext } from '../Context';
import socket from '../Socket';
import Word from './Word';
import { CircularProgress, Button } from '@material-ui/core';

const CodeNames = ({ loggedIn }) => {
  const { state: gameState, dispatch } = useContext(CodenamesContext);

  const currentTeam = gameState.currentTurn;
  const redAmount = gameState.redScore;
  const blueAmount = gameState.blueScore;
  const isGameOver = gameState.isGameOver;
  const wordList = gameState.words;

  const handleSpyMasterBtn = () => {
    dispatch({ type: 'toggle-spymaster' });
  };

  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      {!wordList ? (
        <>
          <h1>Game is loading...</h1>
          <CircularProgress />
        </>
      ) : (
        <>
          <h1>CODENAMES</h1>
          <div className={styles.WordBoardContainer}>
            <div className={styles.currentScoreIndicator} style={{ fontWeight: 'bold' }}>
              <span style={{ color: 'firebrick' }}>{redAmount}</span>
              <span> - </span>
              <span style={{ color: 'royalblue' }}>{blueAmount}</span>
            </div>
            <p
              className={styles.currentTurnIndicator}
              style={{ color: currentTeam === 'Red' ? 'firebrick' : 'royalblue' }}
            >{`${currentTeam}'s turn`}</p>
            <Button
              className={styles.endTurnButton}
              disabled={isGameOver}
              variant="contained"
              onClick={() => socket.emit('change-turn', currentTeam)}
            >
              End Turn
            </Button>

            {wordList.map((item) => (
              <Word item={item} key={item.id} />
            ))}
            <div className={styles.gameOverInfo} style={{ visibility: isGameOver ? 'visible' : 'hidden' }}>
              <h3>{redAmount === 0 ? `Red Won!` : blueAmount === 0 ? `Blue Won!` : `${currentTeam} hit the bomb!`}</h3>
              <Button variant="contained" onClick={() => socket.emit('new-game')}>
                New Game
              </Button>
            </div>
            <Button className={styles.spyMasterBtn} variant="contained" disabled={isGameOver} onClick={() => handleSpyMasterBtn()}>
              Spymaster
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CodeNames;
