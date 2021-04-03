import './App.css';
import CodeNames from './CodeNames/CodeNames';
import { CodenamesContext } from './Context';
import HomePage from './HomePage/HomePage';
import Lobby from './Lobby/Lobby';
import useGameState from './Reducers/CodeNamesReducer';

function App() {
  const [state, dispatch] = useGameState();

  //console.log(boardWords);
  return (
    <CodenamesContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <header className="App-header">
          <div align="center">
            <CodeNames />
            {/* <HomePage /> */}
            {/* <Lobby /> */}
          </div>
        </header>
      </div>
    </CodenamesContext.Provider>
  );
}

export default App;
