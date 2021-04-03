import { useContext, React } from 'react';
import classNames from 'classnames';
import styles from './Word.module.css';
import socket from '../Socket';
import { CodenamesContext } from '../Context';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  UnsafeWord: {
    backgroundColor: ({ isGameOver, isSelected }) => (isGameOver && !isSelected ? 'rgba(222,184,135,0.5)' : 'rgba(222,184,135)'),
  },

  BombWord: {
    backgroundColor: 'rgba(79, 79, 79)',
    color: 'white',
  },

  RedWord: {
    backgroundColor: ({ isGameOver, isSelected }) => (isGameOver && !isSelected ? 'rgba(178, 34, 34,0.5)' : 'rgba(178, 34, 34)'),
    color: 'white !important',
  },

  BlueWord: {
    backgroundColor: ({ isGameOver, isSelected }) => (isGameOver && !isSelected ? 'rgba(65,105,225,0.5)' : 'rgba(65,105,225)'),
    color: 'white !important',
  },
  UnselectedWord: {
    backgroundColor: 'white',
    color: 'black',
  },
});

const Word = ({ item }) => {
  const { state: gameState } = useContext(CodenamesContext);
  const isGameOver = gameState.isGameOver;
  const isSelected = gameState.selectedItems.includes(item.id);
  const isSpyMaster = gameState.isSpyMaster;
  const revealWord = isSelected || isGameOver || isSpyMaster;
  const currentTeam = gameState.currentTurn;
  const classes = useStyles({ isGameOver, isSelected });

  const wordStyle = classNames({
    [styles.Word]: true,
    [styles.NoHover]: revealWord,
    [classes.RedWord]: item.status === `Red` && revealWord,
    [classes.BlueWord]: item.status === `Blue` && revealWord,
    [classes.BombWord]: item.status === `bomb` && revealWord,
    [classes.UnsafeWord]: item.status === `unsafe` && revealWord,
    [classes.UnselectedWord]: !revealWord,
  });

  const handleWordClick = (item) => {
    socket.emit('update-selected', item.id);
    if (item.status === 'Red' || item.status === 'Blue') {
      if ((item.status === 'Red' && gameState.redScore === 1) || (item.status === 'Blue' && gameState.blueScore === 1)) {
        socket.emit('game-over', item.status);
      }
      socket.emit('decrement-score', item.status);
    } else if (item.status === 'bomb') {
      socket.emit('game-over');
    } else if (item.status === 'unsafe') {
      socket.emit('change-turn', currentTeam);
    }
  };

  return (
    <div className={wordStyle} onClick={(e) => handleWordClick(item)}>
      {`${item.word}`}
    </div>
  );
};

export default Word;
