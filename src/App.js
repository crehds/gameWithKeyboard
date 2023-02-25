import './App.css';
import KeyBoard from './components/Keyboard';
import Options from './components/Options';
import { SetupGameProvider } from './context/setupGame';
import GlobalStyle from './GlobalStyles';

function App() {
  return (
    <SetupGameProvider>
      <div className="App">
        <Options />
        <GlobalStyle />
        <KeyBoard />
      </div>
    </SetupGameProvider>
  );
}

export default App;
