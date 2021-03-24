import { useEffect } from 'react';
import './App.css';
import { KeyBoard } from './components/Keyboard';
import { GlobalStyle } from './GlobalStyles';
import { useNextLevel } from './hooks/useNextLevel';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [config, setConfig] = useNextLevel({levels: 15,
  playing: false});
  useEffect(() => {
    setConfig.setPlaying(true)
  },[setConfig])

  return (
    <div className='App'>
      <GlobalStyle />
      <KeyBoard />
    </div>
  );
}

export default App;
