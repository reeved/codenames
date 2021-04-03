import './App.css';
import { Link, Route, Switch } from 'react-router-dom';
import CodeNames from './CodeNames/CodeNames';
import { CodenamesContext } from './Context';
import HomePage from './HomePage/HomePage';
import Lobby from './Lobby/Lobby';
import useGameState from './Reducers/CodeNamesReducer';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core';

function App() {
  const [state, dispatch] = useGameState();

  //console.log(boardWords);
  return (
    <CodenamesContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button>Home</Button>
            </Link>
            <Link to="/lobby" style={{ textDecoration: 'none' }}>
              <Button>Lobby</Button>
            </Link>
            <Link to="/codenames" style={{ textDecoration: 'none' }}>
              <Button>Codenames</Button>
            </Link>
            {/* <Button color="inherit">Home</Button>
            <Button color="inherit">Lobby</Button>
            <Button color="inherit">Codenames</Button> */}
          </Toolbar>
        </AppBar>
        <header className="App-header">
          <div align="center">
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route path="/lobby">
              <Lobby />
            </Route>
            <Route path="/codenames">
              <CodeNames />
            </Route>
          </div>
        </header>
      </div>
    </CodenamesContext.Provider>
  );
}

export default App;
