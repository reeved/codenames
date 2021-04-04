import { useContext, useReducer, useEffect } from 'react';
import socket from '../Socket';

const initialState = {
  nickname: 'Anon',
  team: 'blue',
  isSpyMaster: false,
  currentTurn: 'Red',
  redScore: 8,
  blueScore: 8,
  isGameOver: false,
  words: null,
  selectedItems: [],
  chatMessages: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      return {
        ...state,
      };
    }

    case 'set-nickname': {
      return {
        ...state,
        nickname: action.nickname,
      };
    }

    case 'new-codenames': {
      console.log('Received new game from server.');
      console.log(action.words);
      return {
        ...initialState,
        words: action.words,
      };
    }

    case 'new-chat-message': {
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.msg],
      };
    }

    case 'updated-selected': {
      return {
        ...state,
        selectedItems: [...state.selectedItems, action.itemID],
      };
    }

    case 'decrement-score': {
      return {
        ...state,
        redScore: action.team === 'Red' ? state.redScore - 1 : state.redScore,
        blueScore: action.team === 'Blue' ? state.blueScore - 1 : state.blueScore,
      };
    }

    case 'change-turn': {
      return {
        ...state,
        currentTurn: action.team,
      };
    }

    case 'toggle-spymaster': {
      return {
        ...state,
        isSpyMaster: !state.isSpyMaster,
      };
    }

    case 'game-over': {
      return {
        ...state,
        isGameOver: true,
      };
    }

    default:
      throw new Error(`Invalid Game State reducer action: ${action.type}`);
  }
};

export default function useCodenamesState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * This effect will run on first render to initialise the alive players.
   * We may need to lie about the dependency so that players dont just 'leave'
   */
  useEffect(() => {
    dispatch({
      type: 'init',
    });
  }, []);

  useEffect(() => {
    function newChatMessage(msg) {
      dispatch({
        type: 'new-chat-message',
        msg: msg,
      });
    }

    function setNickname(nickname) {
      dispatch({
        type: 'set-nickname',
        nickname: nickname,
      });
    }

    function newCodenamesGame(boardWords) {
      dispatch({
        type: 'new-codenames',
        words: boardWords,
        selectedWords: [],
      });
    }

    function updateSelected(id) {
      dispatch({
        type: 'updated-selected',
        itemID: id,
      });
    }

    function decrementScore(team) {
      dispatch({
        type: 'decrement-score',
        team: team,
      });
    }

    function changeTurn(team) {
      dispatch({
        type: 'change-turn',
        team: team,
      });
    }

    function setGameOver() {
      dispatch({
        type: 'game-over',
      });
    }

    socket.on('chat message', newChatMessage);
    socket.on('set-nickname', setNickname);
    socket.on('new-codenames', newCodenamesGame);
    socket.on('update-selected', updateSelected);
    socket.on('decrement-score', decrementScore);
    socket.on('game-over', setGameOver);
    socket.on('change-turn', changeTurn);

    return () => {
      socket.removeListener('chat message', newChatMessage);
      socket.removeListener('set-nickname', setNickname);
      socket.removeListener('new-codenames', newCodenamesGame);
      socket.removeListener('update-selected', updateSelected);
      socket.removeListener('decrement-score', decrementScore);
      socket.removeListener('game-over', setGameOver);
      socket.removeListener('change-turn', changeTurn);
    };
  }, [state]);

  return { state, dispatch };
}
