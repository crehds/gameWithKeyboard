import { useEffect } from 'react';
import './App.css';
import { siguienteNivel } from './components/functions';
import { KeyBoard } from './components/Keyboard';
import { GlobalStyle } from './GlobalStyles';
// import { useNextLevel } from './hooks/useNextLevel';

function App() {
  useEffect(() => {
    siguienteNivel(0);
  },[])

  return (
    <div className='App'>
      {console.log('renderizado')}
      <GlobalStyle />
      <KeyBoard />
    </div>
  );
}

export default App;
