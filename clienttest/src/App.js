import logo from './logo.svg';
import './App.css';
import Userdata from './testcomponent/Userdata';
import Container from './testcomponent/Container';

function App() {
  return (
    <div className="App">
      <header className="App-header-min">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Container />
    </div>
  );
}

export default App;
