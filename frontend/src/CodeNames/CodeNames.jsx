import { useState, useContext, React } from 'react';
import styles from './WordBoard.module.css';
import { CodenamesContext } from '../Context';
import socket from '../Socket';
import Word from './Word';

const CodeNames = () => {
  const { state: gameState, dispatch } = useContext(CodenamesContext);

  const currentTeam = gameState.currentTurn;
  const redAmount = gameState.redScore;
  const blueAmount = gameState.blueScore;
  const isGameOver = gameState.isGameOver;
  const wordList = gameState.words;

  const handleSpyMasterBtn = () => {
    dispatch({ type: 'toggle-spymaster' });
  };

  return (
    <div>
      <h1>CODENAMES</h1>

      <div className={styles.WordBoardContainer}>
        <div className={styles.currentScoreIndicator} style={{ fontWeight: 'bold' }}>
          <span style={{ color: 'firebrick' }}>{redAmount}</span>
          <span> - </span>
          <span style={{ color: 'royalblue' }}>{blueAmount}</span>
        </div>
        <p className={styles.currentTurnIndicator} style={{ color: currentTeam === 'Red' ? 'firebrick' : 'royalblue' }}>{`${currentTeam}'s turn`}</p>
        <button className={styles.endTurnButton} disabled={isGameOver} onClick={() => socket.emit('change-turn', currentTeam)}>
          End Turn
        </button>

        {wordList.map((item) => (
          <Word item={item} key={item.id} />
        ))}
        <div className={styles.gameOverInfo} style={{ visibility: isGameOver ? 'visible' : 'hidden' }}>
          <h3>{redAmount === 0 ? `Red Won!` : blueAmount === 0 ? `Blue Won!` : `${currentTeam} hit the bomb!`}</h3>
          <button onClick={() => socket.emit('reset-game')}>New Game</button>
        </div>
        <button className={styles.spyMasterBtn} onClick={() => handleSpyMasterBtn()}>
          Toggle Spymaster
        </button>
      </div>
    </div>
  );
};

export default CodeNames;
