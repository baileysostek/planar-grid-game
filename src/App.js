import logo from './logo.svg';
import './App.css';

// Import our Views
import Game from './views/Game';

// Create a function component to render our Application.
function App() {
  return (
    <div className="App">
      <header className="App-header">
       
        <Game></Game>
      </header>
    </div>
  );
}

export default App;
