import './App.css';
import KeyBoard from './components/Keyboard';
import Options from './components/Options';
import GlobalStyle from './GlobalStyles';
import useSetupGame from './hooks/useSetupGame';

function App() {
  const [config, handleConfig] = useSetupGame();

  return (
    <div className="App">
      <Options handleSetupGame={handleConfig} statusGame={config.playing} />
      <GlobalStyle />
      <KeyBoard />
    </div>
  );
}

export default App;
