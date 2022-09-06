import logo from './logo.svg';
import './App.css';

// Import our Views
import LevelSelect from './views/LevelSelect';

// Create a function component to render our Application.
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LevelSelect></LevelSelect>
      </header>
    </div>
  );
}

export default App;
