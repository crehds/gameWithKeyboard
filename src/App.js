import { useEffect } from 'react';
import './App.css';
import { KeyBoard } from './components/Keyboard';
import { GlobalStyle } from './GlobalStyles';
import { useNextLevel } from './hooks/useNextLevel';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [playing, setPlaying] = useNextLevel(15);
  useEffect(() => {
    setPlaying(true)
  },[setPlaying])

  return (
    <div className='App'>
      <GlobalStyle />
      <KeyBoard />
    </div>
  );
}

export default App;
