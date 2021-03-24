import { useState } from 'react';
import './App.css';
import { KeyBoard } from './components/Keyboard';
import { GlobalStyle } from './GlobalStyles';

function App() {
  const [level, setLevels] = useState(15);
  return (
    <div className='App'>
      <GlobalStyle />
      <KeyBoard />
    </div>
  );
}

export default App;
