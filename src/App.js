import { useEffect } from 'react';
import Swal from 'sweetalert2';
import './App.css';
import { KeyBoard } from './components/Keyboard';
import { Options } from './components/Options';
import { GlobalStyle } from './GlobalStyles';
import { useNextLevel } from './hooks/useNextLevel';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [config, setConfig] = useNextLevel();
  useEffect(() => {
    // setConfig.setPlaying(true);
    handleSetupGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSetupGame() {
    const lvlsPerDifficulty = {
      rookie: 10,
      normal: 14,
      expert: 18,
      eidetic: 22
    };
    const { value: difficulty } = await Swal.fire({
      title: 'Configuración del juego',
      input: 'select',
      inputLabel: 'Selecciona la dificultad',
      inputOptions: {
        rookie: 'Novato - 10 niveles',
        normal: 'Normal - 14 niveles',
        expert: 'Experto - 18 niveles',
        eidetic: 'Eidético - 22 niveles',
      },
      inputValue: 'normal',
      showCancelButton: true,
    });
    if (difficulty) {
      return setConfig({
        levels: lvlsPerDifficulty[difficulty],
        playing: true,
      });
    }
  }

  return (
    <div className='App'>
      <Options handleSetupGame={handleSetupGame} statusGame={config.playing} />
      <GlobalStyle />
      <KeyBoard />
    </div>
  );
}

export default App;
