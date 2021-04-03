import { useContext, React } from 'react';
import classNames from 'classnames';
import styles from './Word.module.css';
import socket from '../Socket';
import { CodenamesContext } from '../Context';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  UnsafeWord: {
    backgroundColor: ({ isGameOver, isSelected }) => (isGameOver && !isSelected ? 'hsl(34, 57%, 90%)' : 'hsl(34, 57%, 60%)'),
  },

  BombWord: {
    backgroundColor: ({ isGameOver, isSelected }) => (isGameOver && !isSelected ? 'hsl(0, 0%, 55%)' : 'hsl(0, 0%, 71%)'),
  },

  RedWord: {
    backgroundColor: ({ isGameOver, isSelected }) => (isGameOver && !isSelected ? 'hsl(0, 68%, 70%)' : 'hsl(0, 68%, 42%)'),
    color: 'white !important',
  },

  BlueWord: {
    backgroundColor: ({ isGameOver, isSelected }) => (isGameOver && !isSelected ? 'hsl(225, 73%, 70%)' : 'hsl(225, 73%, 40%)'),
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
